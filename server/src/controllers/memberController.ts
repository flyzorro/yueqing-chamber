import { Request, Response } from 'express';
import { memberStore } from '../models/memberStore';
import { CreateMemberRequest, UpdateMemberRequest } from '../models/Member';

// 获取会员列表（支持分页）
export const getMembers = (req: Request, res: Response): void => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = memberStore.getPaginated(page, limit);
    res.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取会员列表失败'
    });
  }
};

// 获取单个会员
export const getMember = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const member = memberStore.getById(id);

    if (!member) {
      res.status(404).json({
        success: false,
        error: '会员不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取会员信息失败'
    });
  }
};

// 创建会员
export const createMember = (req: Request, res: Response): void => {
  try {
    const { name, phone, email, company, position, status }: CreateMemberRequest = req.body;

    // 验证必填字段
    if (!name || !phone || !company) {
      res.status(400).json({
        success: false,
        error: '缺少必填字段：name, phone, company'
      });
      return;
    }

    const member = memberStore.create({
      name,
      phone,
      email,
      company,
      position,
      status
    });

    res.status(201).json({
      success: true,
      data: member,
      message: '会员创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建会员失败'
    });
  }
};

// 更新会员
export const updateMember = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updateData: UpdateMemberRequest = req.body;

    const member = memberStore.update(id, updateData);

    if (!member) {
      res.status(404).json({
        success: false,
        error: '会员不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: member,
      message: '会员更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新会员失败'
    });
  }
};

// 删除会员
export const deleteMember = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = memberStore.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: '会员不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '会员删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除会员失败'
    });
  }
};