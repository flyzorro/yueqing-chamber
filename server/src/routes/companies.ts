import { Router, Request, Response } from 'express';
import { companyStore } from '../models/Company';
import { companyProductStore } from '../models/CompanyProduct';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; poster?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] }
  | { type: 'divider' };

const router = Router();
const VALID_COMPANY_STATUS = new Set(['active', 'inactive']);

function parseSummary(raw: string | null | undefined): Block[] | null {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Block[];
    }
    return [{ type: 'paragraph', text: raw.trim() }];
  } catch {
    if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
      return null;
    }
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
 * GET /api/companies
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const industry = typeof req.query.industry === 'string' ? req.query.industry.trim() : '';
    const status = VALID_COMPANY_STATUS.has(rawStatus) ? (rawStatus as 'active' | 'inactive') : undefined;

    const result = await companyStore.getPaginated({ page, limit, keyword, status, industry: industry || undefined });

    res.json({
      success: true,
      data: result.data,
      filters: { keyword, status: status || 'all', industry: industry || 'all' },
      pagination: { total: result.total, page: result.page, limit: result.limit, totalPages: Math.ceil(result.total / result.limit) },
      error: null,
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ success: false, data: [], filters: null, pagination: null, error: '获取企业列表失败' });
  }
});

/**
 * GET /api/companies/:id/products
 */
router.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const company = await companyStore.getById(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, data: null, error: '企业不存在' });
      return;
    }
    const products = await companyProductStore.getByCompanyId(req.params.id);
    res.json({
      success: true,
      data: products.map((p) => ({ id: p.id, name: p.name, description: p.description, imageUrl: p.imageUrl })),
      error: null,
    });
  } catch (error) {
    console.error('Get company products error:', error);
    res.status(500).json({ success: false, data: null, error: '获取产品列表失败' });
  }
});

/**
 * GET /api/companies/industries
 */
router.get('/industries', async (req: Request, res: Response) => {
  try {
    const industries = await companyStore.getIndustries();
    res.json({ success: true, data: industries, error: null });
  } catch (error) {
    console.error('Get industries error:', error);
    res.status(500).json({ success: false, data: [], error: '获取行业分类失败' });
  }
});

/**
 * GET /api/companies/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const company = await companyStore.getById(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, data: null, error: '企业不存在' });
      return;
    }
    res.json({ success: true, data: mapCompanyFields(company as Record<string, unknown>), error: null });
  } catch (error) {
    console.error('Get company detail error:', error);
    res.status(500).json({ success: false, data: null, error: '获取企业详情失败' });
  }
});

/**
 * POST /api/companies/:id/summary
 * 写入企业简介（batch 脚本调用）
 */
router.post('/:id/summary', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    if (typeof description !== 'string' || description.trim().length < 5) {
      res.status(400).json({ success: false, data: null, error: '描述内容太短' });
      return;
    }
    const blocks: Block[] = [
      { type: 'heading', level: 2, text: '公司简介' },
      { type: 'paragraph', text: description.trim() },
    ];
    await companyStore.updateSummary(req.params.id, blocks);
    res.json({ success: true, data: null, error: null });
  } catch (error) {
    console.error('Update summary error:', error);
    res.status(500).json({ success: false, data: null, error: '更新失败' });
  }
});

export default router;
