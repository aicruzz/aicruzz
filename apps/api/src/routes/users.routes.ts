import { Router } from 'express';

const router = Router();

router.get('/me', (req, res) => {
  res.json({
    name: 'Francis',
    videosCreated: 20,
    creditsLeft: 5,
    totalCredits: 20,
  });
});

export default router;