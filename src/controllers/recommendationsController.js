import isRecommendationValid from '../validations/recommendationValidation.js';
import * as recommendationServices from '../services/recommendationsServices.js';

async function postRecommendation(req, res, next) {
    try {
        const { name, youtubeLink, genresIds } = req.body;
        const validRecommendation = isRecommendationValid(req.body);
        if (!validRecommendation.valid) {
            return res.status(400).send(validRecommendation.message);
        }

        await recommendationServices.insertRecommendation({
            name,
            youtubeLink,
            score: 0,
            genresIds,
        });
        return res.sendStatus(201);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.sendStatus(404);
        }
        return next(error);
    }
}

async function vote(req, res, next) {
    try {
        const { id } = req.params;

        if (req.url.includes('upvote')) {
            await recommendationServices.vote(id, '+');
        } else {
            await recommendationServices.vote(id, '-');
        }

        return res.sendStatus(201);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.sendStatus(404);
        }
        return next(error);
    }
}

async function getRecommendation(req, res, next) {
    try {
        const recommendation = await recommendationServices.getRecommendation();
        return res.send(recommendation);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.sendStatus(404);
        }
        return next(error);
    }
}

async function getTopRecommendations(req, res, next) {
    try {
        const { amount } = req.params;
        if (Number.isNaN(Number(amount)) || Number(amount) < 1) {
            return res.sendStatus(400);
        }
        const recommendations =
            await recommendationServices.getTopRecommendations(Number(amount));
        return res.send(recommendations);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.sendStatus(404);
        }
        return next(error);
    }
}

export { postRecommendation, vote, getRecommendation, getTopRecommendations };
