/* eslint-disable no-plusplus */
import connection from '../database/connection.js';

async function getGenreByName(name) {
    const result = await connection.query(
        `
        SELECT * FROM genres WHERE name = $1
    `,
        [name]
    );
    return result.rows[0];
}

async function insertGenre(name) {
    await connection.query(
        `
        INSERT INTO genres (name) VALUES ($1)
    `,
        [name]
    );
}

async function getGenreIdsByNames(names) {
    let baseQuery = 'SELECT id FROM genres WHERE name = $1';
    if (names.length > 1) {
        for (let i = 1; i < names.length; i++) {
            baseQuery += ` OR name = $${i + 1}`;
        }
    }
    const result = await connection.query(baseQuery, names);
    return result.rows.map((genre) => genre.id);
}

async function getAllGenres() {
    const result = await connection.query(`
        SELECT * FROM genres
        ORDER BY name
    `);
    return result.rows;
}

async function setGenresToRecommendation({ genresIds, recommendationId }) {
    const baseQuery =
        'INSERT INTO recommendations_genres (recommendation_id, genre_id) VALUES';
    const values = [];
    genresIds.forEach((genre, i) => {
        values.push(` (${recommendationId}, $${i + 1})`);
    });

    await connection.query(baseQuery + values.join(','), genresIds);
}

export {
    getGenreByName,
    insertGenre,
    getAllGenres,
    setGenresToRecommendation,
    getGenreIdsByNames,
};
