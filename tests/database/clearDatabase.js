import connection from '../../src/database/connection.js';

async function clearDatabase() {
    await connection.query('DELETE FROM recommendations_genres');
    await connection.query('DELETE FROM genres');
    await connection.query('DELETE FROM recommendations');
}

function endConnection() {
    connection.end();
}

export { clearDatabase, endConnection };
