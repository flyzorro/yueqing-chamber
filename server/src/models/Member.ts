// 会员数据模型
export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company: string;
  position?: string;
  joinDate: Date;
  status: 'active' | 'inactive';
}

// 会员创建请求
export interface CreateMemberRequest {
  name: string;
  phone: string;
  email?: string;
  company: string;
  position?: string;
  status?: 'active' | 'inactive';
}

// 会员更新请求
export interface UpdateMemberRequest {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  status?: 'active' | 'inactive';
}