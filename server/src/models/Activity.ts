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

  // 报名活动
  async register(id: string) {
    const activity = await this.getById(id);
    
    if (!activity) {
      return { success: false, error: '活动不存在' };
    }

    const current = activity.currentparticipants || 0;
    if (current >= activity.maxparticipants) {
      return { success: false, error: '报名人数已满' };
    }

    await prisma.activity.update({
      where: { id },
      data: {
        currentparticipants: current + 1
      }
    });

    return { success: true };
  }
}

export const activityStore = new ActivityStore();