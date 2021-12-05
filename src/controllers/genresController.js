import * as genresServices from '../services/genresServices.js';

async function postGenre(req, res, next) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.sendStatus(400);
        }
        await genresServices.createGenre(name);
        return res.send();
    } catch (error) {
        if (error.type === 'Conflict') {
            return res.sendStatus(409);
        }
        return next(error);
    }
}

async function getGenres(req, res, next) {
    try {
        const genres = await genresServices.getGenres();
        return res.send(genres);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.sendStatus(404);
        }
        return next(error);
    }
}

async function getSongsByGenreId(req, res, next) {
    try {
        const { id: genreId } = req.params;
        if (Number.isNaN(Number(genreId))) {
            return res.sendStatus(400);
        }

        const songs = await genresServices.getSongsByGenreId(Number(genreId));
        return res.send(songs);
    } catch (error) {
        if (error.type === 'NotFound') {
            return res.status(404).send(error.message);
        }
        return next(error);
    }
}

export { postGenre, getGenres, getSongsByGenreId };
