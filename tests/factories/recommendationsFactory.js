import faker from 'faker';
import connection from '../../src/database/connection.js';

function recommendationsIncorrectFactory() {
    return {
        name: faker.datatype.number(),
        youtubeLink: faker.datatype.string(),
    };
}

function recommendationsFactory() {
    return {
        name: faker.datatype.string(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
    };
}

async function createRecommendation() {
    const recommendation = {
        name: faker.name.findName(),
        youtubeLink: faker.internet.url(),
        score: faker.datatype.number(),
    };
    const result = await connection.query(
        `INSERT INTO recommendations (name, youtube_link, score)
        VALUES ($1, $2, $3) RETURNING id`,
        [recommendation.name, recommendation.youtubeLink, recommendation.score]
    );
    return result.rows[0].id;
}

export {
    recommendationsIncorrectFactory,
    recommendationsFactory,
    createRecommendation,
};
