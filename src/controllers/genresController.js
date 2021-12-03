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

export { postGenre };
