import * as genresRepositories from '../repositories/genresRepositories.js';
import APIError from '../errors/APIError.js';

async function createGenre(name) {
    const genre = await genresRepositories.getGenreByName(name);
    if (genre) {
        throw new APIError('Genre already exists', 'Conflict');
    }

    await genresRepositories.insertGenre(name);
}

export { createGenre };
