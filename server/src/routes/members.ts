import { Router } from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController';
import { validateMemberCreate } from '../middleware/validator';

const router = Router();

// GET /api/members - 获取会员列表（支持分页）
router.get('/', getMembers);

// GET /api/members/:id - 获取单个会员
router.get('/:id', getMember);

// POST /api/members - 创建会员（添加验证）
router.post('/', validateMemberCreate, createMember);

// PUT /api/members/:id - 更新会员
router.put('/:id', updateMember);

// DELETE /api/members/:id - 删除会员
router.delete('/:id', deleteMember);

export default router;