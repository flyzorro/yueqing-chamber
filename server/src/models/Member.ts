import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { memberFixtureData } from '../data/memberFixture';

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

export interface MemberListFilters {
  page?: number;
  limit?: number;
  keyword?: string;
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
  private buildWhere(filters: MemberListFilters): Prisma.MemberWhereInput {
    const where: Prisma.MemberWhereInput = {};
    const keyword = filters.keyword?.trim();

    if (filters.status) {
      where.status = filters.status;
    }

    if (keyword) {
      where.OR = [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private shouldUseFixtureFallback(error: unknown): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : undefined;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return error.code === 'P2021';
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return true;
    }

    if (errorCode === 'P2021') {
      return true;
    }

    if (error instanceof Error) {
      return (
        error.message.includes("Can't reach database server") ||
        error.message.includes('does not exist in the current database')
      );
    }

    return false;
  }

  private getFixtureMembers(filters: MemberListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const keyword = filters.keyword?.trim().toLowerCase();

    const filtered = memberFixtureData.filter((member) => {
      const matchesStatus = filters.status ? member.status === filters.status : true;
      const matchesKeyword = keyword
        ? member.name.toLowerCase().includes(keyword) || member.company.toLowerCase().includes(keyword)
        : true;

      return matchesStatus && matchesKeyword;
    });

    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      total: filtered.length,
      page,
      limit,
    };
  }

  private getFixtureMemberById(id: string) {
    return memberFixtureData.find((member) => member.id === id) || null;
  }

  // 获取所有会员
  async getAll() {
    try {
      const members = await prisma.member.findMany({
        orderBy: { createdat: 'desc' },
      });
      return members;
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[members] Prisma unavailable, using fixture data for getAll');
        return [...memberFixtureData];
      }
      throw error;
    }
  }

  // 分页获取会员（支持搜索 + 状态筛选）
  async getPaginated(filters: MemberListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    try {
      const [data, total] = await Promise.all([
        prisma.member.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdat: 'desc' },
        }),
        prisma.member.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[members] Prisma unavailable, using fixture data for getPaginated');
        return this.getFixtureMembers(filters);
      }
      throw error;
    }
  }

  // 根据 ID 获取会员
  async getById(id: string) {
    try {
      const member = await prisma.member.findUnique({
        where: { id },
      });
      return member;
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[members] Prisma unavailable, using fixture data for getById');
        return this.getFixtureMemberById(id);
      }
      throw error;
    }
  }

  // 获取会员详情（包含最近活动和报名记录）
  async getDetails(id: string): Promise<MemberDetails | null> {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            activity: true,
          },
          orderBy: {
            createdat: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!member) {
      return null;
    }

    const recentActivities: ActivityRegistration[] = member.registrations.map((reg) => ({
      id: reg.id,
      activityId: reg.activityId,
      activityTitle: reg.activity.title,
      activityDate: reg.activity.date,
      activityLocation: reg.activity.location,
      status: reg.status,
      registeredAt: reg.createdat,
    }));

    const registrationCount = await prisma.registration.count({
      where: { memberId: id },
    });

    return {
      ...member,
      recentActivities,
      registrationCount,
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
        status: request.status || 'active',
      },
    });
    return member;
  }

  // 更新会员
  async update(id: string, request: UpdateMemberRequest) {
    const member = await prisma.member.update({
      where: { id },
      data: request,
    });
    return member;
  }

  // 删除会员
  async delete(id: string) {
    await prisma.member.delete({
      where: { id },
    });
    return true;
  }
}

export const memberStore = new MemberStore();
