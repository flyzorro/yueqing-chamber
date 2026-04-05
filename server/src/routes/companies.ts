import { Router, Request, Response } from 'express';
import { companyStore } from '../models/Company';
import { companyProductStore } from '../models/CompanyProduct';
import { enqueueCompanyFill } from '../services/companyFillQueue';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; poster?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] }
  | { type: 'divider' };

const router = Router();
const VALID_COMPANY_STATUS = new Set(['active', 'inactive']);

/**
 * GET /api/companies
 * 获取企业名单列表（分页 + 搜索 + 状态筛选 + 行业筛选）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const industry = typeof req.query.industry === 'string' ? req.query.industry.trim() : '';
    const status = VALID_COMPANY_STATUS.has(rawStatus) ? (rawStatus as 'active' | 'inactive') : undefined;

    const result = await companyStore.getPaginated({
      page,
      limit,
      keyword,
      status,
      industry: industry || undefined,
    });

    res.json({
      success: true,
      data: result.data,
      filters: {
        keyword,
        status: status || 'all',
        industry: industry || 'all',
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
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      data: [],
      filters: null,
      pagination: null,
      error: '获取企业列表失败',
    });
  }
});

function parseSummary(raw: string | null | undefined): Block[] | null {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Block[];
    }
    // Legacy plain text — wrap in paragraph block
    return [{ type: 'paragraph', text: raw.trim() }];
  } catch {
    // Malformed JSON (looks like JSON but failed to parse) — return null
    if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
      return null;
    }
    // Non-JSON plain text — wrap in paragraph block
    return [{ type: 'paragraph', text: raw.trim() }];
  }
}

function mapCompanyFields(company: Record<string, unknown>) {
  return {
    id: company.id,
    name: company.name,
    industry: company.industry || null,
    contactName: company.contactName || null,
    contactPhone: company.phone || null,
    summary: parseSummary(company.summary as string | null | undefined),
    address: company.address || null,
    status: company.status,
    createdAt: company.createdat,
    updatedAt: company.updatedat,
  };
}

/**
 * GET /api/companies/:id/products
 * 获取企业的产品列表
 * 注意：这个路由必须在 /:id 前面定义，避免 "products" 被当成 id
 */
router.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const company = await companyStore.getById(req.params.id);
    if (!company) {
      res.status(404).json({
        success: false,
        data: null,
        error: '企业不存在',
      });
      return;
    }

    const products = await companyProductStore.getByCompanyId(req.params.id);

    res.json({
      success: true,
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
      })),
      error: null,
    });
  } catch (error) {
    console.error('Get company products error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: '获取产品列表失败',
    });
  }
});

/**
 * GET /api/companies/industries
 * 获取所有行业分类
 */
router.get('/industries', async (req: Request, res: Response) => {
  try {
    const industries = await companyStore.getIndustries();

    res.json({
      success: true,
      data: industries,
      error: null,
    });
  } catch (error) {
    console.error('Get industries error:', error);
    res.status(500).json({
      success: false,
      data: [],
      error: '获取行业分类失败',
    });
  }
});

/**
 * GET /api/companies/:id
 * 获取企业详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const company = await companyStore.getById(req.params.id);

    if (!company) {
      res.status(404).json({
        success: false,
        data: null,
        error: '企业不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: mapCompanyFields(company as Record<string, unknown>),
      error: null,
    });
  } catch (error) {
    console.error('Get company detail error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: '获取企业详情失败',
    });
  }
});

/**
 * POST /api/companies/auto-fill
 * Create a company and trigger async auto-fill of its summary.
 */
router.post('/auto-fill', async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!name) {
      res.status(400).json({ success: false, data: null, error: '企业名称不能为空' });
      return;
    }

    const industry =
      typeof req.body.industry === 'string' ? req.body.industry.trim() : undefined;

    const company = await companyStore.create({ name, industry }) as { id: string; name: string; industry: string | null };

    // Enqueue for background auto-fill (non-blocking)
    enqueueCompanyFill({ companyId: company.id, name, industry, attempt: 1 });

    res.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        industry: company.industry || null,
        summary: null,
        status: 'pending',
      },
      error: null,
    });
  } catch (error) {
    console.error('Auto-fill error:', error);
    res.status(500).json({ success: false, data: null, error: '创建企业失败' });
  }
});

export default router;
