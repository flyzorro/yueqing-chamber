import { Router, Request, Response } from 'express';
import { memberStore } from '../models/Member';
import { validateMemberCreate, validateMemberUpdate } from '../middleware/validator';

const router = Router();

/**
 * GET /api/members
 * 获取会员列表（分页）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await memberStore.getPaginated(page, limit);

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
    console.error('Get members error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取会员列表失败' 
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
        error: '会员不存在' 
      });
      return;
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取会员信息失败' 
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
      data: member
    });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ 
      success: false, 
      error: '创建会员失败' 
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
        error: '会员不存在' 
      });
      return;
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ 
      success: false, 
      error: '更新会员失败' 
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
      message: '会员已删除'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ 
      success: false, 
      error: '删除会员失败' 
    });
  }
});

export default router;
