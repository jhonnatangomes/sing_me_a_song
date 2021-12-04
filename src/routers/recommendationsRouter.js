import { Router } from 'express';
import * as recommendationsController from '../controllers/recommendationsController.js';

const router = new Router();

router.post('', recommendationsController.postRecommendation);
router.post('/:id/upvote', recommendationsController.vote);
router.post('/:id/downvote', recommendationsController.vote);
router.get('/random', recommendationsController.getRecommendation);
router.get('/top/:amount', recommendationsController.getTopRecommendations);

export default router;
