import { Prisma } from '@prisma/client';
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

export interface MemberListFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: 'active' | 'inactive';
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

  // 获取所有会员
  async getAll() {
    const members = await prisma.member.findMany({
      orderBy: { createdat: 'desc' },
    });
    return members;
  }

  // 分页获取会员
  async getPaginated(filters: MemberListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

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
  }

  // 根据 ID 获取会员
  async getById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
    });
    return member;
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
