import app from '../../src/app.js';
import supertest from 'supertest';

import {
    recommendationsIncorrectFactory,
    recommendationsFactory,
    createRecommendation,
    nonExistentGenreRecommendationFactory,
} from '../factories/recommendationsFactory.js';

import { createGenre } from '../factories/genresFactory.js';

import { clearDatabase, endConnection } from '../database/clearDatabase.js';

const agent = supertest(app);

afterAll(async () => {
    await clearDatabase();
    endConnection();
});

describe('post /recommendations', () => {
    const genres = [];

    afterEach(async () => {
        const result = await createGenre();
        const result2 = await createGenre();
        genres.push(result.id);
        genres.push(result2.id);
    });

    it('should return 404 for a non-existent genre sent', async () => {
        const result = await agent
            .post('/recommendations')
            .send(nonExistentGenreRecommendationFactory());
        expect(result.status).toEqual(404);
    });

    it('should return 201 for correct data sent', async () => {
        const result = await agent
            .post('/recommendations')
            .send(recommendationsFactory(genres));
        expect(result.status).toEqual(201);
    });

    it('should return 400 for incorrect data sent', async () => {
        const result = await agent
            .post('/recommendations')
            .send(recommendationsIncorrectFactory());
        expect(result.status).toEqual(400);
    });
});

describe('post /recommendations/:id/upvote', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it('returns 400 if amount is not a number', async () => {
        const result = await agent.post('/recommendations/a/upvote');
        expect(result.status).toEqual(400);
    });

    it('returns 400 if amount is less than 1', async () => {
        const result = await agent.post('/recommendations/0/upvote');
        expect(result.status).toEqual(400);
    });

    it('returns 404 for a non-existent id in database', async () => {
        const result = await agent.post('/recommendations/1/upvote');
        expect(result.status).toEqual(404);
    });

    it('returns 201 for an existent id in database', async () => {
        const { recommendationId: id } = await createRecommendation();
        const result = await agent.post(`/recommendations/${id}/upvote`);
        expect(result.status).toEqual(201);
    });
});

describe('post /recommendations/:id/downvote', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it('returns 400 if amount is not a number', async () => {
        const result = await agent.post('/recommendations/a/downvote');
        expect(result.status).toEqual(400);
    });

    it('returns 400 if amount is less than 1', async () => {
        const result = await agent.post('/recommendations/0/downvote');
        expect(result.status).toEqual(400);
    });

    it('returns 404 for a non-existent id in database', async () => {
        const result = await agent.post('/recommendations/1/downvote');
        expect(result.status).toEqual(404);
    });

    it('returns 201 for an existent id in database', async () => {
        const { recommendationId: id } = await createRecommendation();
        const result = await agent.post(`/recommendations/${id}/downvote`);
        expect(result.status).toEqual(201);
    });
});

describe('get /recommendations/random', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        await createRecommendation();
    });

    it('returns 404 for no recommendations in database', async () => {
        const result = await agent.get('/recommendations/random');
        expect(result.status).toEqual(404);
    });

    it('returns 200 for recommendation in database', async () => {
        const result = await agent.get('/recommendations/random');
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('name');
        expect(result.body).toHaveProperty('youtubeLink');
        expect(result.body).toHaveProperty('score');
        expect(result.body).toHaveProperty('genres');
        expect(result.body.genres[0]).toHaveProperty('id');
        expect(result.body.genres[0]).toHaveProperty('name');
    });
});

describe('get /recommendations/top/:amount', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        await createRecommendation();
    });

    it('returns 404 if no recommendations exist', async () => {
        const result = await agent.get('/recommendations/top/2');
        expect(result.status).toEqual(404);
    });

    it('returns 400 if amount is not a number', async () => {
        const result = await agent.get('/recommendations/top/as');
        expect(result.status).toEqual(400);
    });

    it('returns 400 if amount is less than 1', async () => {
        const result = await agent.get('/recommendations/top/0');
        expect(result.status).toEqual(400);
    });

    it('returns 200 and an array of songs', async () => {
        const result = await agent.get('/recommendations/top/4');
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(3);
        expect(result.body[0]).toHaveProperty('id');
        expect(result.body[0]).toHaveProperty('name');
        expect(result.body[0]).toHaveProperty('youtubeLink');
        expect(result.body[0]).toHaveProperty('score');
        expect(result.body[0]).toHaveProperty('genres');
        expect(result.body[0].genres[0]).toHaveProperty('id');
        expect(result.body[0].genres[0]).toHaveProperty('name');
    });
});

describe('get /recommendations/genres/:id/random', () => {
    let genreId;

    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        const result = await createRecommendation();
        genreId = result.genreId;
    });

    it('should return 404 for no recommendations in database', async () => {
        const result = await agent.get('/recommendations/genres/1/random');
        expect(result.status).toEqual(404);
    });

    it('should return 404 for non-existent genre', async () => {
        const result = await agent.get(
            `/recommendations/genres/${genreId + 100}/random`
        );
        expect(result.status).toEqual(404);
    });

    it('should return 400 for a non-numerical id provided', async () => {
        const result = await agent.get('/recommendations/genres/asas/random');
        expect(result.status).toEqual(400);
    });

    it('should return 400 for an id less than 1 provided', async () => {
        const result = await agent.get('/recommendations/genres/0/random');
        expect(result.status).toEqual(400);
    });

    it('should return 200 and a random recommendation', async () => {
        const result = await agent.get(
            `/recommendations/genres/${genreId}/random`
        );
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('name');
        expect(result.body).toHaveProperty('genres');
        expect(result.body).toHaveProperty('youtubeLink');
        expect(result.body).toHaveProperty('score');
        expect(result.body.genres[0]).toHaveProperty('id');
        expect(result.body.genres[0]).toHaveProperty('name');
    });
});
