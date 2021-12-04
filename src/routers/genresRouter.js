import { Router } from 'express';
import * as genresController from '../controllers/genresController.js';

const router = new Router();

router.post('', genresController.postGenre);
router.get('', genresController.getGenres);

export default router;
