import faker from 'faker-br';
import connection from '../../src/database/connection.js';
import { createGenre } from './genresFactory.js';

function recommendationsIncorrectFactory() {
    return {
        name: faker.random.number(),
        youtubeLink: faker.random.word(),
        genres: [faker.random.number()],
    };
}

function recommendationsFactory(genresIds) {
    return {
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
        genresIds,
    };
}

function nonExistentGenreRecommendationFactory() {
    return {
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
        genresIds: [faker.random.number()],
    };
}

async function createRecommendation() {
    const recommendation = {
        name: faker.name.findName(),
        youtubeLink: faker.internet.url(),
        score: faker.random.number(),
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

    return { recommendationId: result.rows[0].id, genreId: genre.id };
}

export {
    recommendationsIncorrectFactory,
    recommendationsFactory,
    createRecommendation,
    nonExistentGenreRecommendationFactory,
};
