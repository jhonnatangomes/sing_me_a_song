import connection from '../../src/database/connection.js';

export default async function clearDatabase() {
    await connection.query('DELETE FROM recommendations');
}
