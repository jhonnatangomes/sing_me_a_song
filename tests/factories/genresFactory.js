import faker from 'faker';
import connection from '../../src/database/connection.js';

async function createGenre() {
    const name = faker.name.findName();
    await connection.query(`INSERT INTO genres (name) VALUES ($1)`, [name]);
}

export { createGenre };
