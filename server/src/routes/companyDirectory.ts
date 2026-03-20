import { Router, Request, Response } from 'express';
import { companyDirectoryStore } from '../models/CompanyDirectory';

const router = Router();

/**
 * GET /api/company-directory
 * 获取企业名录列表（分页 + 搜索）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';

    const result = await companyDirectoryStore.getPaginated({
      page,
      limit,
      keyword,
    });

    res.json({
      success: true,
      data: result.data,
      filters: {
        keyword,
      },
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error('Get company directory error:', error);
    res.status(500).json({
      success: false,
      error: '获取企业名录失败',
    });
  }
});

export default router;
