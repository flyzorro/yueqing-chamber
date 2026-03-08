import { Router } from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  registerActivity
} from '../controllers/activityController';
import { validateActivityCreate } from '../middleware/validator';

const router = Router();

// GET /api/activities - 获取活动列表（支持分页）
router.get('/', getActivities);

// GET /api/activities/:id - 获取单个活动
router.get('/:id', getActivity);

// POST /api/activities - 创建活动（添加验证）
router.post('/', validateActivityCreate, createActivity);

// PUT /api/activities/:id - 更新活动
router.put('/:id', updateActivity);

// DELETE /api/activities/:id - 删除活动
router.delete('/:id', deleteActivity);

// POST /api/activities/:id/register - 报名活动
router.post('/:id/register', registerActivity);

export default router;