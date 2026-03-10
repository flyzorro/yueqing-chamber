import { Router, Request, Response } from 'express';
import { memberStore } from '../models/Member';
import { validateMemberCreate, validateMemberUpdate } from '../middleware/validator';

const router = Router();
const VALID_MEMBER_STATUS = new Set(['active', 'inactive']);

/**
 * GET /api/members
 * 获取会员列表（分页 + 搜索 + 状态筛选）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const status = VALID_MEMBER_STATUS.has(rawStatus) ? (rawStatus as 'active' | 'inactive') : undefined;

    const result = await memberStore.getPaginated({
      page,
      limit,
      keyword,
      status,
    });

    res.json({
      success: true,
      data: result.data,
      filters: {
        keyword,
        status: status || 'all',
      },
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      error: '获取会员列表失败',
    });
  }
});

/**
 * GET /api/members/:id
 * 获取单个会员
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const member = await memberStore.getById(req.params.id);

    if (!member) {
      res.status(404).json({
        success: false,
        error: '会员不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      error: '获取会员信息失败',
    });
  }
});

/**
 * POST /api/members
 * 创建会员
 */
router.post('/', validateMemberCreate, async (req: Request, res: Response) => {
  try {
    const member = await memberStore.create(req.body);

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({
      success: false,
      error: '创建会员失败',
    });
  }
});

/**
 * PUT /api/members/:id
 * 更新会员
 */
router.put('/:id', validateMemberUpdate, async (req: Request, res: Response) => {
  try {
    const member = await memberStore.update(req.params.id, req.body);

    if (!member) {
      res.status(404).json({
        success: false,
        error: '会员不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      error: '更新会员失败',
    });
  }
});

/**
 * DELETE /api/members/:id
 * 删除会员
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await memberStore.delete(req.params.id);

    res.json({
      success: true,
      message: '会员已删除',
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      error: '删除会员失败',
    });
  }
});

/**
 * GET /api/members/:id/details
 * 获取会员详情（包含最近活动和报名记录）
 */
router.get('/:id/details', async (req: Request, res: Response) => {
  try {
    const details = await memberStore.getDetails(req.params.id);
    
    if (!details) {
      res.status(404).json({ 
        success: false, 
        error: '会员不存在' 
      });
      return;
    }

    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    console.error('Get member details error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取会员详情失败' 
    });
  }
});

export default router;
