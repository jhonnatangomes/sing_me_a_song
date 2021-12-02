import app from '../../src/app.js';
import supertest from 'supertest';

import {
    recommendationsIncorrectFactory,
    recommendationsFactory,
} from '../factories/recommendationsFactory.js';

import clearDatabase from '../database/clearDatabase.js';

const agent = supertest(app);

afterAll(async () => {
    await clearDatabase();
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
