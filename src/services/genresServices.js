import * as genresRepositories from '../repositories/genresRepositories.js';
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

async function checkIfGenresExist(genres) {
    const allGenres = await genresRepositories.getAllGenres();

    const allGenresNames = allGenres.map((genre) => genre.name);

    const noGenre = genres.find((genre) => !allGenresNames.includes(genre));

    if (noGenre) {
        throw new APIError(`${noGenre} doesnt exist`, 'NotFound');
    }
}

async function getGenreIdsByNames(genres) {
    const genresIds = await genresRepositories.getGenreIdsByNames(genres);
    return genresIds;
}

async function setGenresToRecommendation({ genres, recommendationId }) {
    const genresIds = await getGenreIdsByNames(genres);
    await genresRepositories.setGenresToRecommendation({
        genresIds,
        recommendationId,
    });
}

export {
    createGenre,
    getGenres,
    checkIfGenresExist,
    setGenresToRecommendation,
};
