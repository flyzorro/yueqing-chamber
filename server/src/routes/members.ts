import { Router } from 'express';

const router = Router();

// GET /api/members - 获取会员列表
router.get('/', (req, res) => {
  res.json({ message: '获取会员列表', data: [] });
});

// GET /api/members/:id - 获取单个会员
router.get('/:id', (req, res) => {
  res.json({ message: '获取会员详情', id: req.params.id });
});

// POST /api/members - 创建会员
router.post('/', (req, res) => {
  res.json({ message: '创建会员', data: req.body });
});

// PUT /api/members/:id - 更新会员
router.put('/:id', (req, res) => {
  res.json({ message: '更新会员', id: req.params.id, data: req.body });
});

// DELETE /api/members/:id - 删除会员
router.delete('/:id', (req, res) => {
  res.json({ message: '删除会员', id: req.params.id });
});

export default router;