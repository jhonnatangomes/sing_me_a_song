import connection from '../database/connection.js';

async function insertRecommendation({ name, youtubeLink, score }) {
    await connection.query(
        `
        INSERT INTO recommendations (name, youtube_link, score)
        VALUES ($1, $2, $3);
    `,
        [name, youtubeLink, score]
    );
}

async function getRecommendationByLink(youtubeLink) {
    const result = await connection.query(
        `
        SELECT * FROM recommendations WHERE youtube_link = $1
    `,
        [youtubeLink]
    );
    return result.rows[0];
}

async function getRecommendationById(id) {
    const result = await connection.query(
        `
        SELECT * FROM recommendations WHERE id = $1
    `,
        [id]
    );
    return result.rows[0];
}

async function changeScore({ name, youtubeLink, score }) {
    const result = await connection.query(
        `
        UPDATE recommendations SET name = $1, score = $2 WHERE youtube_link = $3
        RETURNING *;
    `,
        [name, score, youtubeLink]
    );
    return result.rows[0];
}

async function deleteRecommendation(id) {
    await connection.query(
        `
        DELETE FROM recommendations WHERE id = $1
    `,
        [id]
    );
}

async function getAllRecommendations() {
    const result = await connection.query(`SELECT * FROM recommendations`);
    return result.rows;
}

async function getTopRecommendations(amount) {
    const result = await connection.query(
        `
        SELECT * FROM recommendations
        ORDER BY score DESC
        LIMIT $1
    `,
        [amount]
    );
    return result.rows;
}

export {
    insertRecommendation,
    getRecommendationByLink,
    getRecommendationById,
    changeScore,
    deleteRecommendation,
    getAllRecommendations,
    getTopRecommendations,
};
