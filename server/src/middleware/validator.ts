import { Request, Response, NextFunction } from 'express';

// 手机号验证正则
const PHONE_REGEX = /^1[3-9]\d{9}$/;

// 邮箱验证正则
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 验证手机号格式
export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

// 验证邮箱格式
export const validateEmail = (email: string): boolean => {
  if (!email) return true; // 邮箱可选
  return EMAIL_REGEX.test(email);
};

// 会员创建验证中间件
export const validateMemberCreate = (req: Request, res: Response, next: NextFunction): void => {
  const { name, phone, email, company } = req.body;

  // 必填字段
  if (!name || !phone || !company) {
    res.status(400).json({
      success: false,
      error: '缺少必填字段：name, phone, company'
    });
    return;
  }

  // 手机号格式
  if (!validatePhone(phone)) {
    res.status(400).json({
      success: false,
      error: '手机号格式不正确'
    });
    return;
  }

  // 邮箱格式
  if (email && !validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: '邮箱格式不正确'
    });
    return;
  }

  next();
};

// 活动创建验证中间件
export const validateActivityCreate = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, date, location, maxParticipants } = req.body;

  // 必填字段
  if (!title || !description || !date || !location) {
    res.status(400).json({
      success: false,
      error: '缺少必填字段：title, description, date, location'
    });
    return;
  }

  // 日期格式
  if (isNaN(Date.parse(date))) {
    res.status(400).json({
      success: false,
      error: '日期格式不正确'
    });
    return;
  }

  // 最大参与人数
  if (maxParticipants !== undefined && maxParticipants < 1) {
    res.status(400).json({
      success: false,
      error: '最大参与人数必须大于0'
    });
    return;
  }

  next();
};

// 活动更新验证中间件
export const validateActivityUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { date, maxParticipants } = req.body;

  // 日期格式（如果提供）
  if (date && isNaN(Date.parse(date))) {
    res.status(400).json({
      success: false,
      error: '日期格式不正确'
    });
    return;
  }

  // 最大参与人数
  if (maxParticipants !== undefined && maxParticipants < 1) {
    res.status(400).json({
      success: false,
      error: '最大参与人数必须大于0'
    });
    return;
  }

  next();
};

// 会员更新验证中间件
export const validateMemberUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { phone, email } = req.body;

  // 手机号格式（如果提供）
  if (phone && !validatePhone(phone)) {
    res.status(400).json({
      success: false,
      error: '手机号格式不正确'
    });
    return;
  }

  // 邮箱格式
  if (email && !validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: '邮箱格式不正确'
    });
    return;
  }

  next();
};