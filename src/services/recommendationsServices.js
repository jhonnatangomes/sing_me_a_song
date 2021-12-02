import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';

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

export { insertRecommendation };
