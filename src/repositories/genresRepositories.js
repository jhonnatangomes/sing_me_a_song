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

export { getGenreByName, insertGenre };
