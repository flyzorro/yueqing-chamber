import prisma from '../lib/prisma';

export interface CreateActivityRequest {
  title: string;
  description: string;
  date: string | Date;
  location: string;
  maxParticipants: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  date?: string | Date;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export class ActivityStore {
  // 获取所有活动
  async getAll() {
    const activities = await prisma.activity.findMany({
      orderBy: { date: 'asc' }
    });
    return activities;
  }

  // 分页获取活动
  async getPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        orderBy: { date: 'asc' }
      }),
      prisma.activity.count()
    ]);

    return { data, total, page, limit };
  }

  // 根据 ID 获取活动
  async getById(id: string) {
    const activity = await prisma.activity.findUnique({
      where: { id }
    });
    return activity;
  }

  // 创建活动
  async create(request: CreateActivityRequest) {
    const activity = await prisma.activity.create({
      data: {
        title: request.title,
        description: request.description,
        date: new Date(request.date),
        location: request.location,
        maxparticipants: request.maxParticipants,
        status: request.status || 'upcoming'
      }
    });
    return activity;
  }

  // 更新活动
  async update(id: string, request: UpdateActivityRequest) {
    const data: any = {};
    if (request.title) data.title = request.title;
    if (request.description !== undefined) data.description = request.description;
    if (request.date) data.date = new Date(request.date);
    if (request.location) data.location = request.location;
    if (request.maxParticipants !== undefined) data.maxparticipants = request.maxParticipants;
    if (request.currentParticipants !== undefined) data.currentparticipants = request.currentParticipants;
    if (request.status) data.status = request.status;
    
    const activity = await prisma.activity.update({
      where: { id },
      data
    });
    return activity;
  }

  // 删除活动
  async delete(id: string) {
    await prisma.activity.delete({
      where: { id }
    });
    return true;
  }

  // 报名活动 - 通过 memberId 报名
  async registerById(activityId: string, memberId: string) {
    const activity = await this.getById(activityId);

    if (!activity) {
      return { success: false, error: '活动不存在' };
    }

    // 检查活动状态
    if (activity.status === 'completed' || activity.status === 'cancelled') {
      return { success: false, error: '该活动不接受报名' };
    }

    try {
      // 事务：原子性地检查容量、防止重复报名、递增计数
      await prisma.$transaction(async (tx) => {
        // 检查是否已存在报名记录
        const existing = await tx.registration.findUnique({
          where: {
            memberId_activityId: {
              memberId,
              activityId
            }
          }
        });

        if (existing) {
          throw new Error('ALREADY_REGISTERED');
        }

        // 获取最新的活动数据并检查容量
        const currentActivity = await tx.activity.findUnique({
          where: { id: activityId }
        });

        // 显式检查 null/undefined（0 是有效值）
        if (
          currentActivity?.currentparticipants === null ||
          currentActivity?.maxparticipants === null ||
          currentActivity!.currentparticipants >= currentActivity!.maxparticipants
        ) {
          throw new Error('ACTIVITY_FULL');
        }

        // 条件更新：只有 currentparticipants < maxparticipants 时才成功
        const updated = await tx.activity.update({
          where: {
            id: activityId,
            currentparticipants: { lt: currentActivity!.maxparticipants }
          },
          data: {
            currentparticipants: { increment: 1 }
          }
        });

        // 如果没有行被更新，说明容量已满
        if (!updated) {
          throw new Error('ACTIVITY_FULL');
        }

        // 容量检查通过后创建报名记录
        await tx.registration.create({
          data: {
            memberId,
            activityId
          }
        });
      });

      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message === 'ALREADY_REGISTERED') {
        return { success: false, error: '您已报名该活动' };
      }
      if (error instanceof Error && error.message === 'ACTIVITY_FULL') {
        return { success: false, error: '报名人数已满' };
      }
      // Prisma P2002: Unique constraint violation
      if (error instanceof Error && error.message.includes('P2002')) {
        return { success: false, error: '您已报名该活动' };
      }
      console.error('Register error:', error);
      return { success: false, error: '报名失败，请稍后重试' };
    }
  }
}

export const activityStore = new ActivityStore();