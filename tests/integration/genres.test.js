import app from '../../src/app.js';
import supertest from 'supertest';

import stringFactory from '../factories/stringFactory.js';

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
