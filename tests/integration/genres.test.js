import app from '../../src/app.js';
import supertest from 'supertest';

import stringFactory from '../factories/stringFactory.js';
import { createGenre } from '../factories/genresFactory.js';
import { createRecommendation } from '../factories/recommendationsFactory.js';

import { clearDatabase, endConnection } from '../database/clearDatabase.js';

const agent = supertest(app);

afterAll(async () => {
    await clearDatabase();
    endConnection();
});

describe('post /genres', () => {
    const name = stringFactory();
    it('returns 400 for no name in body', async () => {
        const result = await agent.post('/genres');
        expect(result.status).toEqual(400);
    });

    it('returns 200 and inserts new genre', async () => {
        const result = await agent.post('/genres').send({ name });
        expect(result.status).toEqual(200);
    });

    it('returns 409 when trying to insert same genre', async () => {
        const result = await agent.post('/genres').send({ name });
        expect(result.status).toEqual(409);
    });
});

describe('get /genres', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        await createGenre();
        await createGenre();
        await createGenre();
    });

    it('returns 404 for no genres', async () => {
        const result = await agent.get('/genres');
        expect(result.status).toEqual(404);
    });

    it('returns 200 and an array of genres', async () => {
        const result = await agent.get('/genres');
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(3);
        expect(result.body[0]).toHaveProperty('id');
        expect(result.body[0]).toHaveProperty('name');
    });
});

describe('get /genres/:id', () => {
    let genreId;

    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        const result = await createRecommendation();
        genreId = result.genreId;
    });

    it('returns 404 if no recommendations exist', async () => {
        const result = await agent.get('/genres/1');
        expect(result.status).toEqual(404);
        expect(result.text).toEqual('No recommendations found');
    });

    it('returns 400 if id supplied is not a number', async () => {
        const result = await agent.get('/genres/as');
        expect(result.status).toEqual(400);
    });

    it('returns 404 if a genre with no recommendations is given', async () => {
        const result = await agent.get(`/genres/${genreId + 100}`);
        expect(result.status).toEqual(404);
    });

    it('returns 200 if an existent genre with recommendations is given', async () => {
        const result = await agent.get(`/genres/${genreId}`);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('name');
        expect(result.body).toHaveProperty('score');
        expect(result.body).toHaveProperty('recommendations');
        expect(result.body.recommendations[0]).toHaveProperty('id');
        expect(result.body.recommendations[0]).toHaveProperty('name');
        expect(result.body.recommendations[0]).toHaveProperty('genres');
        expect(result.body.recommendations[0].genres[0]).toHaveProperty('id');
        expect(result.body.recommendations[0].genres[0]).toHaveProperty('name');
    });
});
