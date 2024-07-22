import {
  createInfluencer,
  searchInfluencersHandler,
  getInfluencerById,
} from '../controllers/influencerController';

import { authMiddleware } from '../middlewares/authMiddleware';
import router from '../plugins/router';

router.post('/', authMiddleware, createInfluencer);
router.get('/search', authMiddleware, searchInfluencersHandler);
router.get('/:influencerId', getInfluencerById);

export default router;
