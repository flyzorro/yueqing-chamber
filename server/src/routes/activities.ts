import { Router, Request, Response } from 'express';
import { activityStore } from '../models/Activity';
import { validateActivityCreate, validateActivityUpdate } from '../middleware/validator';

const router = Router();

/**
 * GET /api/activities
 * 获取活动列表（分页）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await activityStore.getPaginated(page, limit);

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
    console.error('Get activities error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取活动列表失败' 
    });
  }
});

/**
 * GET /api/activities/:id
 * 获取单个活动
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await activityStore.getById(req.params.id);
    
    if (!activity) {
      res.status(404).json({ 
        success: false, 
        error: '活动不存在' 
      });
      return;
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取活动信息失败' 
    });
  }
});

/**
 * POST /api/activities
 * 创建活动
 */
router.post('/', validateActivityCreate, async (req: Request, res: Response) => {
  try {
    const activity = await activityStore.create(req.body);

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ 
      success: false, 
      error: '创建活动失败' 
    });
  }
});

/**
 * PUT /api/activities/:id
 * 更新活动
 */
router.put('/:id', validateActivityUpdate, async (req: Request, res: Response) => {
  try {
    const activity = await activityStore.update(req.params.id, req.body);
    
    if (!activity) {
      res.status(404).json({ 
        success: false, 
        error: '活动不存在' 
      });
      return;
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ 
      success: false, 
      error: '更新活动失败' 
    });
  }
});

/**
 * DELETE /api/activities/:id
 * 删除活动
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await activityStore.delete(req.params.id);

    res.json({
      success: true,
      message: '活动已删除'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ 
      success: false, 
      error: '删除活动失败' 
    });
  }
});

/**
 * POST /api/activities/:id/register
 * 报名活动
 */
router.post('/:id/register', async (req: Request, res: Response) => {
  try {
    const result = await activityStore.register(req.params.id);
    
    if (!result.success) {
      res.status(400).json({ 
        success: false, 
        error: result.error 
      });
      return;
    }

    res.json({
      success: true,
      message: '报名成功'
    });
  } catch (error) {
    console.error('Register activity error:', error);
    res.status(500).json({ 
      success: false, 
      error: '报名失败' 
    });
  }
});

export default router;
