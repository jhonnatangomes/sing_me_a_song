import isRecommendationValid from '../validations/recommendationValidation.js';
import * as recommendationServices from '../services/recommendationsServices.js';

async function postRecommendation(req, res, next) {
    try {
        const { name, youtubeLink } = req.body;
        const validRecommendation = isRecommendationValid(req.body);
        if (!validRecommendation.valid) {
            return res.status(400).send(validRecommendation.message);
        }

        await recommendationServices.insertRecommendation({
            name,
            youtubeLink,
            score: 0,
        });
        return res.sendStatus(201);
    } catch (error) {
        return next(error);
    }
}

export { postRecommendation };
