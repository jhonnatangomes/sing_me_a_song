import '../dotenv/setup.js';
import express from 'express';
import cors from 'cors';

import errorMiddleware from './middlewares/errorMiddleware.js';
import recommendationsRouter from './routers/recommendationsRouter.js';
import genresRouter from './routers/genresRouter.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/recommendations', recommendationsRouter);
app.use('/genres', genresRouter);
app.use(errorMiddleware);

export default app;
