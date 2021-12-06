import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';
import * as genresServices from './genresServices.js';
import * as helpersServices from './helpersServices.js';
import APIError from '../errors/APIError.js';

async function insertRecommendation({ name, youtubeLink, score, genresIds }) {
    await genresServices.checkIfGenresExist(genresIds);

    const recommendation =
        await recommendationsRepositories.getRecommendationByLink(youtubeLink);

    if (recommendation) {
        await recommendationsRepositories.changeScore({
            name,
            youtubeLink,
            score: recommendation.score + 1,
        });
    } else {
        const result = await recommendationsRepositories.insertRecommendation({
            name,
            youtubeLink,
            score,
        });
        await genresServices.setGenresToRecommendation({
            genresIds,
            recommendationId: result.id,
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

async function getRecommendation() {
    const recommendations = await helpersServices.getAllRecommendations();

    const filteredRecommendations = await helpersServices.getRecommendation(
        recommendations
    );
    return filteredRecommendations;
}

async function getTopRecommendations(amount) {
    const recommendations =
        await recommendationsRepositories.getAllRecommendations(amount);

    if (!recommendations.length) {
        throw new APIError('No recommendations found', 'NotFound');
    }
    return recommendations;
}

async function getRandomRecommendationByGenre(genreId) {
    const recommendations = await genresServices.getSongsByGenreId(genreId);

    const filteredRecommendations = await helpersServices.getRecommendation(
        recommendations.recommendations
    );
    return filteredRecommendations;
}

export {
    insertRecommendation,
    vote,
    getRecommendation,
    getTopRecommendations,
    getRandomRecommendationByGenre,
};
