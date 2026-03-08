import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

class UserStore {
  private users: Map<string, User> = new Map();

  // 生成唯一 ID
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 根据手机号查找用户
  getByPhone(phone: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  // 根据 ID 查找用户
  getById(id: string): User | undefined {
    return this.users.get(id);
  }

  // 创建用户（注册）
  async create(request: RegisterRequest): Promise<User | null> {
    // 检查手机号是否已存在
    const existingUser = this.getByPhone(request.phone);
    if (existingUser) {
      return null;
    }

    // 密码加密（使用更强的 rounds）
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(request.password, salt);

    const user: User = {
      id: this.generateId(),
      phone: request.phone,
      password: hashedPassword,
      name: request.name,
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }

  // 验证密码
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 更新用户信息
  update(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id,
      phone: user.phone,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // 获取所有用户（不含密码）
  getAll(): Omit<User, 'password'>[] {
    return Array.from(this.users.values()).map(({ password, ...user }) => user);
  }
}

export const userStore = new UserStore();
