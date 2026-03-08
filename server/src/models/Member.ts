import prisma from '../lib/prisma';

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  company: string;
  position?: string | null;
  joinDate: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

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

export class MemberStore {
  // 获取所有会员
  async getAll(): Promise<Member[]> {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return members;
  }

  // 分页获取会员
  async getPaginated(page: number = 1, limit: number = 10): Promise<{
    data: Member[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.member.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.member.count()
    ]);

    return { data, total, page, limit };
  }

  // 根据 ID 获取会员
  async getById(id: string): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: { id }
    });
    return member;
  }

  // 创建会员
  async create(request: CreateMemberRequest): Promise<Member> {
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
  async update(id: string, request: UpdateMemberRequest): Promise<Member | null> {
    const member = await prisma.member.update({
      where: { id },
      data: request
    });
    return member;
  }

  // 删除会员
  async delete(id: string): Promise<boolean> {
    await prisma.member.delete({
      where: { id }
    });
    return true;
  }
}

export const memberStore = new MemberStore();
