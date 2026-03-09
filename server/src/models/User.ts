import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

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
  async getByPhone(phone: string) {
    const user = await prisma.user.findUnique({
      where: { phone }
    });
    return user;
  }

  // 根据 ID 查找用户
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  }

  // 创建用户（注册）
  async create(request: RegisterRequest) {
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
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 更新用户信息
  async update(id: string, updates: any) {
    const user = await prisma.user.update({
      where: { id },
      data: updates
    });
    return user;
  }

  // 获取所有用户（不含密码）
  async getAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        createdat: true,
        updatedat: true
      }
    });
    return users;
  }
}

export const userStore = new UserStore();