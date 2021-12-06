import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';
import getRandomInt from '../helpers/getRandomInt.js';
import APIError from '../errors/APIError.js';

async function getAllRecommendations() {
    const recommendations =
        await recommendationsRepositories.getAllRecommendations();

    if (!recommendations.length) {
        throw new APIError('No recommendations found', 'NotFound');
    }

    return recommendations;
}

async function getRecommendation(recommendations) {
    const onlySongsAbove10Score = [];
    const onlySongsBelowOrEqual10Score = [];

    recommendations.forEach((song) => {
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

export { getAllRecommendations, getRecommendation };
