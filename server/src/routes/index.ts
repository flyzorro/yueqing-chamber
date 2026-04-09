import { Router } from 'express';
import membersRouter from './members';
import companiesRouter from './companies';
import civilServantsRouter from './civilServants';
import activitiesRouter from './activities';
import authRouter from './auth';
import informationRouter from './information';

const router = Router();

// 会员管理
router.use('/members', membersRouter);

// 企业名单
router.use('/companies', companiesRouter);

// 公务员名单
router.use('/civil-servants', civilServantsRouter);

// 活动管理
router.use('/activities', activitiesRouter);

// 认证（待实现）
router.use('/auth', authRouter);

// 信息发布
router.use('/information', informationRouter);

export default router;