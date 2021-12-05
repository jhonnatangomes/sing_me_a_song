import connection from '../database/connection.js';

async function insertRecommendation({ name, youtubeLink, score }) {
    const result = await connection.query(
        `
        INSERT INTO recommendations (name, youtube_link, score)
        VALUES ($1, $2, $3) RETURNING id;
    `,
        [name, youtubeLink, score]
    );
    return result.rows[0];
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

async function getAllRecommendations(amount) {
    let baseQuery = `
    SELECT recommendations.id AS recommendation_id,
    recommendations.name AS recommendation_name,
    recommendations.youtube_link,
    recommendations.score,
    genres.id AS genre_id,
    genres.name AS genre_name
    FROM recommendations JOIN recommendations_genres
    ON recommendations.id = recommendations_genres.recommendation_id
    JOIN genres
    ON recommendations_genres.genre_id = genres.id
    `;

    if (amount) {
        baseQuery += ' ORDER BY score DESC LIMIT $1';
    }

    const result = amount
        ? await connection.query(baseQuery, [amount])
        : await connection.query(baseQuery);

    const newArray = [];

    result.rows.forEach((song) => {
        if (!newArray.some((el) => el.name === song.recommendation_name)) {
            song.id = song.recommendation_id;
            song.name = song.recommendation_name;
            song.genres = [
                {
                    id: song.genre_id,
                    name: song.genre_name,
                },
            ];
            song.youtubeLink = song.youtube_link;

            delete song.genre_id;
            delete song.genre_name;
            delete song.recommendation_id;
            delete song.recommendation_name;
            delete song.youtube_link;
            newArray.push(song);
        } else {
            newArray[newArray.length - 1].genres.push({
                id: song.genre_id,
                name: song.genre_name,
            });
        }
    });

    return newArray;
}

export {
    insertRecommendation,
    getRecommendationByLink,
    getRecommendationById,
    changeScore,
    deleteRecommendation,
    getAllRecommendations,
};
