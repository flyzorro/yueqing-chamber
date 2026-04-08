import { Router, Request, Response } from 'express';
import { activityStore } from '../models/Activity';
import { activityPhotoStore } from '../models/ActivityPhoto';
import { memberStore } from '../models/Member';
import prisma from '../lib/prisma';
import { validateActivityCreate, validateActivityUpdate } from '../middleware/validator';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * GET /api/activities
 * 获取活动列表（分页）
 */
/**
 * Transform snake_case activity fields to camelCase for API responses
 */
function transformActivity(activity: any) {
  return {
    ...activity,
    currentParticipants: activity.currentparticipants,
    maxParticipants: activity.maxparticipants,
    createdAt: activity.createdat,
    updatedAt: activity.updatedat,
  };
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await activityStore.getPaginated(page, limit);

    res.json({
      success: true,
      data: result.data.map(transformActivity),
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
      data: transformActivity(activity)
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
      data: transformActivity(activity)
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
      data: transformActivity(activity)
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
router.post('/:id/register', authenticate, async (req: Request, res: Response) => {
  try {
    // 通过手机号查找会员
    let member = await memberStore.findByPhone(req.user!.phone);

    // 如果没有会员记录，检查是否为管理员
    if (!member) {
      const isAdmin = (process.env.ADMIN_PHONES?.split(',').map(s => s.trim()).filter(Boolean) || []).includes(req.user!.phone);

      if (isAdmin) {
        // 为管理员自动创建会员记录
        member = await memberStore.create({
          phone: req.user!.phone,
          name: req.user!.name,
          company: req.user!.company || '管理员',
          position: req.user!.position || '管理员'
        });

        if (!member) {
          res.status(400).json({
            success: false,
            error: '创建会员信息失败'
          });
          return;
        }
      } else {
        res.status(400).json({
          success: false,
          error: '未找到会员信息，请先注册会员'
        });
        return;
      }
    }

    const result = await activityStore.registerById(req.params.id, member.id);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(201).json({
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

/**
 * GET /api/activities/:id/registrations
 * 获取活动报名者列表（需要管理员权限）
 */
router.get('/:id/registrations', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const activity = await activityStore.getById(req.params.id);

    if (!activity) {
      res.status(404).json({
        success: false,
        error: '活动不存在'
      });
      return;
    }

    const registrations = await prisma.registration.findMany({
      where: { activityId: req.params.id },
      include: {
        member: true
      },
      orderBy: { createdat: 'asc' }
    });

    const registrationList = registrations.map((reg) => ({
      id: reg.id,
      member: {
        id: reg.member.id,
        name: reg.member.name,
        company: reg.member.company,
        position: reg.member.position,
        phone: reg.member.phone
      },
      registeredAt: reg.createdat
    }));

    res.json({
      success: true,
      data: registrationList
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      error: '获取报名者列表失败'
    });
  }
});

/**
 * GET /api/activities/:id/photos
 * 获取活动相册（纯展示）
 */
router.get('/:id/photos', async (req: Request, res: Response) => {
  try {
    const activity = await activityStore.getById(req.params.id);

    if (!activity) {
      res.status(404).json({
        success: false,
        error: '活动不存在'
      });
      return;
    }

    const photos = await activityPhotoStore.getByActivityId(req.params.id);

    res.json({
      success: true,
      data: {
        activity: {
          id: activity.id,
          title: activity.title,
        },
        photos,
      },
    });
  } catch (error) {
    console.error('Get activity photos error:', error);
    res.status(500).json({
      success: false,
      error: '获取活动相册失败'
    });
  }
});

export default router;
