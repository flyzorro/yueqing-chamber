import { Router } from 'express';

const router = Router();

// GET /api/activities - 获取活动列表
router.get('/', (req, res) => {
  res.json({ message: '获取活动列表', data: [] });
});

// GET /api/activities/:id - 获取单个活动
router.get('/:id', (req, res) => {
  res.json({ message: '获取活动详情', id: req.params.id });
});

// POST /api/activities - 创建活动
router.post('/', (req, res) => {
  res.json({ message: '创建活动', data: req.body });
});

// PUT /api/activities/:id - 更新活动
router.put('/:id', (req, res) => {
  res.json({ message: '更新活动', id: req.params.id, data: req.body });
});

// DELETE /api/activities/:id - 删除活动
router.delete('/:id', (req, res) => {
  res.json({ message: '删除活动', id: req.params.id });
});

export default router;