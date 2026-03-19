import { Router } from 'express';
import membersRouter from './members';
import activitiesRouter from './activities';
import authRouter from './auth';
import companiesRouter from './companies';

const router = Router();

// 会员管理
router.use('/members', membersRouter);

// 活动管理
router.use('/activities', activitiesRouter);

// 企业名录
router.use('/companies', companiesRouter);

// 认证（待实现）
router.use('/auth', authRouter);

export default router;