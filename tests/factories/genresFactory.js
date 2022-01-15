import faker from 'faker-br';
import connection from '../../src/database/connection.js';

async function createGenre() {
    const name = faker.name.findName();
    const result = await connection.query(
        `INSERT INTO genres (name) VALUES ($1) RETURNING *`,
        [name]
    );
    return result.rows[0];
}

export { createGenre };
