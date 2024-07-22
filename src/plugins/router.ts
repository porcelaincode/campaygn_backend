import { Router } from 'express';
import { checkBlacklist } from '../middlewares/blacklistMiddleware';

const router = Router();

router.use(checkBlacklist);

export default router;
