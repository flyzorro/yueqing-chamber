import prisma from '../lib/prisma';

export interface CreateMemberRequest {
  name: string;
  phone: string;
  email?: string;
  company: string;
  position?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateMemberRequest {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  status?: 'active' | 'inactive';
}

export interface MemberDetails {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string;
  position: string | null;
  joindate: Date | null;
  status: string | null;
  createdat: Date | null;
  updatedat: Date | null;
  recentActivities: ActivityRegistration[];
  registrationCount: number;
}

export interface ActivityRegistration {
  id: string;
  activityId: string;
  activityTitle: string;
  activityDate: Date;
  activityLocation: string;
  status: string | null;
  registeredAt: Date | null;
}

export class MemberStore {
  // 获取所有会员
  async getAll() {
    const members = await prisma.member.findMany({
      orderBy: { createdat: 'desc' }
    });
    return members;
  }

  // 分页获取会员
  async getPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.member.findMany({
        skip,
        take: limit,
        orderBy: { createdat: 'desc' }
      }),
      prisma.member.count()
    ]);

    return { data, total, page, limit };
  }

  // 根据 ID 获取会员
  async getById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id }
    });
    return member;
  }

  // 获取会员详情（包含最近活动和报名记录）
  async getDetails(id: string): Promise<MemberDetails | null> {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            activity: true
          },
          orderBy: {
            createdat: 'desc'
          },
          take: 10
        }
      }
    });

    if (!member) {
      return null;
    }

    const recentActivities: ActivityRegistration[] = member.registrations.map(reg => ({
      id: reg.id,
      activityId: reg.activityId,
      activityTitle: reg.activity.title,
      activityDate: reg.activity.date,
      activityLocation: reg.activity.location,
      status: reg.status,
      registeredAt: reg.createdat
    }));

    const registrationCount = await prisma.registration.count({
      where: { memberId: id }
    });

    return {
      ...member,
      recentActivities,
      registrationCount
    };
  }

  // 创建会员
  async create(request: CreateMemberRequest) {
    const member = await prisma.member.create({
      data: {
        name: request.name,
        phone: request.phone,
        email: request.email,
        company: request.company,
        position: request.position,
        status: request.status || 'active'
      }
    });
    return member;
  }

  // 更新会员
  async update(id: string, request: UpdateMemberRequest) {
    const member = await prisma.member.update({
      where: { id },
      data: request
    });
    return member;
  }

  // 删除会员
  async delete(id: string) {
    await prisma.member.delete({
      where: { id }
    });
    return true;
  }
}

export const memberStore = new MemberStore();