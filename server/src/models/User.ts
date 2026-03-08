import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  avatar?: string | null;
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

export class UserStore {
  // 根据手机号查找用户
  async getByPhone(phone: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { phone }
    });
    return user;
  }

  // 根据 ID 查找用户
  async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  }

  // 创建用户（注册）
  async create(request: RegisterRequest): Promise<User | null> {
    // 检查手机号是否已存在
    const existingUser = await this.getByPhone(request.phone);
    if (existingUser) {
      return null;
    }

    // 密码加密
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(request.password, salt);

    const user = await prisma.user.create({
      data: {
        phone: request.phone,
        password: hashedPassword,
        name: request.name
      }
    });

    return user;
  }

  // 验证密码
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 更新用户信息
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data: updates
    });
    return user;
  }

  // 获取所有用户（不含密码）
  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return users;
  }
}

export const userStore = new UserStore();
