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

// ✅ FIX: put status BEFORE :id
router.get('/:id/status', getVideoStatus);
router.get('/:id', getVideo);

router.delete('/:id', deleteVideo);

export default router;