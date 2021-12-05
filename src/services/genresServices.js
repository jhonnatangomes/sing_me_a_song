import * as genresRepositories from '../repositories/genresRepositories.js';
import * as recommendationsRepositories from '../repositories/recommendationsRepositories.js';
import APIError from '../errors/APIError.js';

async function createGenre(name) {
    const genre = await genresRepositories.getGenreByName(name);
    if (genre) {
        throw new APIError('Genre already exists', 'Conflict');
    }

    await genresRepositories.insertGenre(name);
}

async function getGenres() {
    const genres = await genresRepositories.getAllGenres();
    if (!genres.length) {
        throw new APIError('No genres in database', 'NotFound');
    }

    return genres;
}

async function checkIfGenresExist(genresIds) {
    const allGenres = await genresRepositories.getAllGenres();

    const allGenresIds = allGenres.map((genre) => genre.id);

    const noGenre = genresIds.find((genre) => !allGenresIds.includes(genre));

    if (noGenre) {
        throw new APIError(`${noGenre} doesnt exist`, 'NotFound');
    }
}

async function setGenresToRecommendation({ genresIds, recommendationId }) {
    await genresRepositories.setGenresToRecommendation({
        genresIds,
        recommendationId,
    });
}

async function getSongsByGenreId(genreId) {
    const recommendations =
        await recommendationsRepositories.getAllRecommendations();

    if (!recommendations.length) {
        throw new APIError('No recommendations found', 'NotFound');
    }

    const recommendationsById = recommendations.filter((song) =>
        song.genres.some((genre) => genre.id === genreId)
    );

    if (!recommendationsById.length) {
        throw new APIError('Genre doesnt exist', 'NotFound');
    }

    const name = await genresRepositories.getGenreNameById(genreId);
    const score = recommendationsById.reduce((a, b) => a.score + b.score);

    return {
        id: genreId,
        name,
        score,
        recommendations: recommendationsById,
    };
}

export {
    createGenre,
    getGenres,
    checkIfGenresExist,
    setGenresToRecommendation,
    getSongsByGenreId,
};
