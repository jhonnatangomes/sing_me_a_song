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

async function changeScore({ name, youtubeLink, score }) {
    await connection.query(
        `
        UPDATE recommendations SET name = $1, score = $2 WHERE youtube_link = $3;
    `,
        [name, score, youtubeLink]
    );
}

export { insertRecommendation, getRecommendationByLink, changeScore };
