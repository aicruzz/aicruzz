import { Router } from 'express';
import {
  listVideos,
  getVideo,
  generateVideo,
  deleteVideo,
  getVideoStatus,
} from '../controllers/videos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All video routes require authentication
router.use(authMiddleware);

router.get('/', listVideos);
router.post('/generate', generateVideo);
router.get('/:id', getVideo);
router.get('/:id/status', getVideoStatus);
router.delete('/:id', deleteVideo);

export default router;
