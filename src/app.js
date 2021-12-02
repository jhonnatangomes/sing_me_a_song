import '../dotenv/setup.js';
import express from 'express';
import cors from 'cors';

import * as recommendationsController from './controllers/recommendationsController.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/recommendations', recommendationsController.postRecommendation);
app.post('/recommendations/:id/upvote', recommendationsController.upVote);
app.use(errorMiddleware);

export default app;
