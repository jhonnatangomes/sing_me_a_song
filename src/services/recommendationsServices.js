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

async function upVote(id) {
    const recommendation =
        await recommendationsRepositories.getRecommendationById(id);

    if (!recommendation) {
        throw new APIError('This recommendation doesnt exist', 'NotFound');
    }

    await recommendationsRepositories.changeScore({
        name: recommendation.name,
        youtubeLink: recommendation.youtube_link,
        score: recommendation.score + 1,
    });
}

export { insertRecommendation, upVote };
