import app from '../../src/app.js';
import supertest from 'supertest';

import {
    recommendationsIncorrectFactory,
    recommendationsFactory,
    createRecommendation,
} from '../factories/recommendationsFactory.js';

import { clearDatabase, endConnection } from '../database/clearDatabase.js';

const agent = supertest(app);

afterAll(async () => {
    await clearDatabase();
    endConnection();
});

describe('post /recommendations', () => {
    it('should return 400 for incorrect data sent', async () => {
        const result = await agent
            .post('/recommendations')
            .send(recommendationsIncorrectFactory());
        expect(result.status).toEqual(400);
    });

    it('should return 200 for correct data sent', async () => {
        const result = await agent
            .post('/recommendations')
            .send(recommendationsFactory());
        expect(result.status).toEqual(201);
    });
});

describe('post /recommendations/:id/upvote', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it('returns 404 for a non-existent id in database', async () => {
        const result = await agent.post('/recommendations/1/upvote');
        expect(result.status).toEqual(404);
    });

    it('returns 201 for an existent id in database', async () => {
        const id = await createRecommendation();
        const result = await agent.post(`/recommendations/${id}/upvote`);
        expect(result.status).toEqual(201);
    });
});

describe('post /recommendations/:id/downvote', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it('returns 404 for a non-existent id in database', async () => {
        const result = await agent.post('/recommendations/1/downvote');
        expect(result.status).toEqual(404);
    });

    it('returns 201 for an existent id in database', async () => {
        const id = await createRecommendation();
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
    });
});
