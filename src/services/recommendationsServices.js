import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';
import APIError from '../errors/APIError.js';

async function insertRecommendation({ name, youtubeLink, score }) {
    const recommendation =
        await recommendationsRepositories.getRecommendationByLink(youtubeLink);

    if (recommendation) {
        await recommendationsRepositories.changeScore({
            name,
            youtubeLink,
            score: recommendation.score + 1,
        });
    } else {
        await recommendationsRepositories.insertRecommendation({
            name,
            youtubeLink,
            score,
        });
    }
}

async function vote(id, type) {
    const recommendation =
        await recommendationsRepositories.getRecommendationById(id);

    if (!recommendation) {
        throw new APIError('This recommendation doesnt exist', 'NotFound');
    }

    if (type === '+') {
        await recommendationsRepositories.changeScore({
            name: recommendation.name,
            youtubeLink: recommendation.youtube_link,
            score: recommendation.score + 1,
        });
    } else {
        const result = await recommendationsRepositories.changeScore({
            name: recommendation.name,
            youtubeLink: recommendation.youtube_link,
            score: recommendation.score - 1,
        });
        if (result.score < -5) {
            await recommendationsRepositories.deleteRecommendation(result.id);
        }
    }
}

export { insertRecommendation, vote };
