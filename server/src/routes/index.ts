import { Router } from 'express';
import membersRouter from './members';
import companyDirectoryRouter from './companyDirectory';
import activitiesRouter from './activities';
import authRouter from './auth';

const router = Router();

// 会员管理
router.use('/members', membersRouter);

// 企业名录
router.use('/company-directory', companyDirectoryRouter);

// 活动管理
router.use('/activities', activitiesRouter);

// 认证（待实现）
router.use('/auth', authRouter);

export default router;