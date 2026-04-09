import { Router, Request, Response } from 'express';
import { informationStore, type UpdateInfoRequest } from '../models/Information';
import { authenticate } from '../middleware/auth';
import { VALID_CATEGORIES, type InfoCategory } from '../constants/info-categories';

const router = Router();

function mapInfoFields(info: Record<string, unknown>) {
  return {
    id: info.id,
    title: info.title,
    content: info.content,
    category: info.category,
    contactname: info.contactname || null,
    contactphone: info.contactphone || null,
    publisherid: info.publisherid,
    createdAt: info.createdat,
    updatedAt: info.updatedat,
  };
}

/**
 * GET /api/information
 * 获取信息列表（公开）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const publisherid = typeof req.query.publisherid === 'string' ? req.query.publisherid.trim() : '';
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const category = VALID_CATEGORIES.includes(rawCategory as InfoCategory) ? (rawCategory as InfoCategory) : undefined;

    const result = await informationStore.getPaginated({ page, limit, category, publisherid: publisherid || undefined, keyword });

    res.json({
      success: true,
      data: result.data.map(mapInfoFields),
      filters: { category: category || 'all', publisherid: publisherid || 'all', keyword: keyword || 'all' },
      pagination: { total: result.total, page: result.page, limit: result.limit, totalPages: Math.ceil(result.total / result.limit) },
      error: null,
    });
  } catch (error) {
    console.error('Get information error:', error);
    res.status(500).json({ success: false, data: [], filters: null, pagination: null, error: '获取信息列表失败' });
  }
});

/**
 * GET /api/information/categories
 * 获取分类列表（公开）
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await informationStore.getCategories();
    res.json({
      success: true,
      data: categories,
      error: null,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, data: [], error: '获取分类失败' });
  }
});

/**
 * GET /api/information/:id
 * 获取信息详情（公开）
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const info = await informationStore.getById(req.params.id);
    if (!info) {
      res.status(404).json({ success: false, data: null, error: '信息不存在' });
      return;
    }
    res.json({
      success: true,
      data: mapInfoFields(info as Record<string, unknown>),
      error: null,
    });
  } catch (error) {
    console.error('Get information detail error:', error);
    res.status(500).json({ success: false, data: null, error: '获取信息详情失败' });
  }
});

/**
 * POST /api/information
 * 创建信息（需登录）
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, content, category, contactname, contactphone } = req.body;

    // 验证必填字段
    if (!title || typeof title !== 'string' || title.trim().length < 1) {
      res.status(400).json({ success: false, data: null, error: '标题不能为空' });
      return;
    }

    if (!content || typeof content !== 'string' || content.trim().length < 1) {
      res.status(400).json({ success: false, data: null, error: '内容不能为空' });
      return;
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      res.status(400).json({ success: false, data: null, error: '分类无效' });
      return;
    }

    const info = await informationStore.create({
      title: title.trim(),
      content: content.trim(),
      category: category as InfoCategory,
      contactname: typeof contactname === 'string' ? contactname.trim() : undefined,
      contactphone: typeof contactphone === 'string' ? contactphone.trim() : undefined,
      publisherid: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: mapInfoFields(info as Record<string, unknown>),
      error: null,
    });
  } catch (error) {
    console.error('Create information error:', error);
    res.status(500).json({ success: false, data: null, error: '创建信息失败' });
  }
});

/**
 * PUT /api/information/:id
 * 更新信息（需登录）
 */
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const info = await informationStore.getById(req.params.id);
    if (!info) {
      res.status(404).json({ success: false, data: null, error: '信息不存在' });
      return;
    }

    // 检查发布权限
    if (info.publisherid !== req.user!.userId) {
      res.status(403).json({ success: false, data: null, error: '无权限修改此信息' });
      return;
    }

    const { title, content, category, contactname, contactphone } = req.body;
    const updateData: Partial<UpdateInfoRequest> = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 1) {
        res.status(400).json({ success: false, data: null, error: '标题无效' });
        return;
      }
      updateData.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length < 1) {
        res.status(400).json({ success: false, data: null, error: '内容无效' });
        return;
      }
      updateData.content = content.trim();
    }

    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        res.status(400).json({ success: false, data: null, error: '分类无效' });
        return;
      }
      updateData.category = category;
    }

    if (contactname !== undefined) {
      const trimmed = typeof contactname === 'string' ? contactname.trim() : '';
      if (trimmed.length > 0) {
        updateData.contactname = trimmed;
      }
    }

    if (contactphone !== undefined) {
      const trimmed = typeof contactphone === 'string' ? contactphone.trim() : '';
      if (trimmed.length > 0) {
        updateData.contactphone = trimmed;
      }
    }

    const updated = await informationStore.update(req.params.id, updateData);
    res.json({
      success: true,
      data: mapInfoFields(updated as Record<string, unknown>),
      error: null,
    });
  } catch (error) {
    console.error('Update information error:', error);
    res.status(500).json({ success: false, data: null, error: '更新信息失败' });
  }
});

/**
 * DELETE /api/information/:id
 * 删除信息（仅管理员）
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const adminPhones = (process.env.ADMIN_PHONES?.split(',').map(s => s.trim()).filter(Boolean)) || [];
    const isUserAdmin = req.user?.phone && adminPhones.includes(req.user.phone);

    if (!isUserAdmin) {
      res.status(403).json({ success: false, data: null, error: '仅管理员可删除信息' });
      return;
    }

    const info = await informationStore.getById(req.params.id);
    if (!info) {
      res.status(404).json({ success: false, data: null, error: '信息不存在' });
      return;
    }

    await informationStore.delete(req.params.id);
    res.json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error) {
    console.error('Delete information error:', error);
    res.status(500).json({ success: false, data: null, error: '删除信息失败' });
  }
});

export default router;
