import faker from 'faker';
import connection from '../../src/database/connection.js';

async function createGenre() {
    const name = faker.name.findName();
    const result = await connection.query(
        `INSERT INTO genres (name) VALUES ($1) RETURNING name`,
        [name]
    );
    return result.rows[0].name;
}

export { createGenre };
