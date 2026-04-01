import { Router, Request, Response } from 'express';
import { civilServantStore } from '../models/CivilServant';

const router = Router();
const VALID_CIVIL_SERVANT_STATUS = new Set(['active', 'inactive']);

/**
 * GET /api/civil-servants
 * 获取公务员名单列表（分页 + 搜索 + 状态筛选）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const status = VALID_CIVIL_SERVANT_STATUS.has(rawStatus) ? (rawStatus as 'active' | 'inactive') : undefined;

    const result = await civilServantStore.getPaginated({
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
      error: null,
    });
  } catch (error) {
    console.error('Get civil servants error:', error);
    res.status(500).json({
      success: false,
      data: [],
      filters: null,
      pagination: null,
      error: '获取公务员名单失败',
    });
  }
});

export default router;
