import faker from 'faker';
import connection from '../../src/database/connection.js';
import { createGenre } from './genresFactory.js';

function recommendationsIncorrectFactory() {
    return {
        name: faker.datatype.number(),
        youtubeLink: faker.datatype.string(),
        genres: [faker.datatype.number()],
    };
}

function recommendationsFactory(genresIds) {
    return {
        name: faker.datatype.string(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
        genresIds,
    };
}

function nonExistentGenreRecommendationFactory() {
    return {
        name: faker.datatype.string(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
        genresIds: [faker.datatype.number()],
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

    const genre = await createGenre();

    await connection.query(
        `
        INSERT INTO recommendations_genres
        (recommendation_id, genre_id) VALUES
        ($1, $2)
    `,
        [result.rows[0].id, genre.id]
    );

    return result.rows[0].id;
}

export {
    recommendationsIncorrectFactory,
    recommendationsFactory,
    createRecommendation,
    nonExistentGenreRecommendationFactory,
};
