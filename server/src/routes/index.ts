import { Router } from 'express';
import membersRouter from './members';
import activitiesRouter from './activities';
import authRouter from './auth';

const router = Router();

router.use('/members', membersRouter);
router.use('/activities', activitiesRouter);
router.use('/auth', authRouter);

export default router;