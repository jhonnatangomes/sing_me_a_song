import '../dotenv/setup.js';
import express from 'express';
import cors from 'cors';

import * as recommendationsController from './controllers/recommendationsController.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/recommendations', recommendationsController.postRecommendation);
app.post('/recommendations/:id/upvote', recommendationsController.vote);
app.post('/recommendations/:id/downvote', recommendationsController.vote);
app.get('/recommendations/random', recommendationsController.getRecommendation);
app.get(
    '/recommendations/top/:amount',
    recommendationsController.getTopRecommendations
);
app.use(errorMiddleware);

export default app;
