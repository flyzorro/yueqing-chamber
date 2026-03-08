import { Router } from './routes';

const router = Router();

// 会员管理
router.use('/members', require('./members'));

// 活动管理
router.use('/activities', require('./activities'));

// 认证（待实现）
router.use('/auth', require('./auth'));

export default router;