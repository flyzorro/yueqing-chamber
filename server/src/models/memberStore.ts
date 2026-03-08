import { Member, CreateMemberRequest, UpdateMemberRequest } from './Member';

// 内存存储 - 使用 Map 实现
class MemberStore {
  private members: Map<string, Member> = new Map();

  // 生成唯一 ID
  private generateId(): string {
    return `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取所有会员
  getAll(): Member[] {
    return Array.from(this.members.values());
  }

  // 分页获取会员
  getPaginated(page: number = 1, limit: number = 10): {
    data: Member[];
    total: number;
    page: number;
    limit: number;
  } {
    const allMembers = this.getAll();
    const total = allMembers.length;
    const startIndex = (page - 1) * limit;
    const data = allMembers.slice(startIndex, startIndex + limit);

    return { data, total, page, limit };
  }

  // 根据 ID 获取会员
  getById(id: string): Member | undefined {
    return this.members.get(id);
  }

  // 创建会员
  create(request: CreateMemberRequest): Member {
    const member: Member = {
      id: this.generateId(),
      name: request.name,
      phone: request.phone,
      email: request.email,
      company: request.company,
      position: request.position,
      joinDate: new Date(),
      status: request.status || 'active'
    };

    this.members.set(member.id, member);
    return member;
  }

  // 更新会员
  update(id: string, request: UpdateMemberRequest): Member | undefined {
    const existingMember = this.members.get(id);
    if (!existingMember) {
      return undefined;
    }

    const updatedMember: Member = {
      ...existingMember,
      ...request
    };

    this.members.set(id, updatedMember);
    return updatedMember;
  }

  // 删除会员
  delete(id: string): boolean {
    return this.members.delete(id);
  }
}

// 导出单例实例
export const memberStore = new MemberStore();