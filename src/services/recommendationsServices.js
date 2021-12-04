import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';
import * as genresServices from './genresServices.js';
import getRandomInt from '../helpers/getRandomInt.js';
import APIError from '../errors/APIError.js';

async function insertRecommendation({ name, youtubeLink, score, genres }) {
    await genresServices.checkIfGenresExist(genres);

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
            genres,
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
    const recommendations =
        await recommendationsRepositories.getAllRecommendations();

    if (!recommendations.length) {
        throw new APIError('No recommendations found', 'NotFound');
    }

    const onlySongsAbove10Score = [];
    const onlySongsBelowOrEqual10Score = [];

    recommendations.forEach((song) => {
        song.youtubeLink = song.youtube_link;
        delete song.youtube_link;

        if (song.score > 10) {
            onlySongsAbove10Score.push(song);
        } else {
            onlySongsBelowOrEqual10Score.push(song);
        }
    });

    if (!onlySongsAbove10Score.length || !onlySongsBelowOrEqual10Score.length) {
        const randomIndex = getRandomInt(0, recommendations.length - 1);
        return recommendations[randomIndex];
    }

    const randomPercentage = getRandomInt(1, 10);
    if (randomPercentage <= 7) {
        const randomIndex = getRandomInt(0, onlySongsAbove10Score.length - 1);
        return onlySongsAbove10Score[randomIndex];
    }

    const randomIndex = getRandomInt(
        0,
        onlySongsBelowOrEqual10Score.length - 1
    );
    return onlySongsBelowOrEqual10Score[randomIndex];
}

async function getTopRecommendations(amount) {
    const recommendations =
        await recommendationsRepositories.getAllRecommendations(amount);

    if (!recommendations.length) {
        throw new APIError('No recommendations found', 'NotFound');
    }
    return recommendations.map((song) => ({
        id: song.id,
        name: song.name,
        youtubeLink: song.youtube_link,
        score: song.score,
    }));
}

export { insertRecommendation, vote, getRecommendation, getTopRecommendations };
