import * as helpersServices from '../../src/services/helpersServices.js';
import * as recommendationsRepositories from '../../src/repositories/recommendationsRepositories.js';
import getRandomInt from '../../src/helpers/getRandomInt.js';
import APIError from '../../src/errors/APIError.js';

const sut = helpersServices;
jest.mock('../../src/helpers/getRandomInt.js');

describe('get all recommendations', () => {
    const getAllRecommendations = jest.spyOn(
        recommendationsRepositories,
        'getAllRecommendations'
    );

    it('throws error when there are no recommendations', async () => {
        getAllRecommendations.mockImplementationOnce(() => []);

        const result = sut.getAllRecommendations();
        await expect(result).rejects.toThrow(APIError);
    });

    it('returns recommendations when there are recommendations', async () => {
        getAllRecommendations.mockImplementationOnce(() => [
            { id: 1, name: 'Forró' },
        ]);
        const result = await sut.getAllRecommendations();
        expect(result).toEqual([{ id: 1, name: 'Forró' }]);
    });
});

describe('get recommendation', () => {
    it('picks a random song among all songs when there are only songs with score bigger than 10', async () => {
        const recommendations = [{ score: 12 }, { score: 15 }, { score: 18 }];
        getRandomInt.mockImplementation(() => 0);

        const result = await sut.getRecommendation(recommendations);

        expect(getRandomInt).toHaveBeenCalledWith(
            0,
            recommendations.length - 1
        );
        expect(result).toEqual(recommendations[0]);
    });

    it('picks a random song among all songs when there are only songs with score equal to or less than 10', async () => {
        const recommendations = [{ score: 8 }, { score: 10 }, { score: 9 }];
        const result = await sut.getRecommendation(recommendations);

        expect(getRandomInt).toHaveBeenCalledWith(
            0,
            recommendations.length - 1
        );
        expect(result).toEqual(recommendations[0]);
    });

    it('picks a random song among the ones with score bigger than 10 for percentage equal to 6', async () => {
        getRandomInt.mockReset();
        getRandomInt.mockImplementationOnce(() => 6);
        getRandomInt.mockImplementationOnce(() => 0);

        const recommendations = [{ score: 8 }, { score: 11 }, { score: 12 }];
        const result = await sut.getRecommendation(recommendations);
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[1]);
    });

    it('picks a random song among the ones with score bigger than 10 for percentage equal to 7', async () => {
        getRandomInt.mockImplementationOnce(() => 7);
        getRandomInt.mockImplementationOnce(() => 0);

        const recommendations = [{ score: 8 }, { score: 11 }, { score: 12 }];
        const result = await sut.getRecommendation(recommendations);
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[1]);
    });

    it('picks a random song among the ones with score less than or equal to 10 for percentage equal to 8', async () => {
        getRandomInt.mockImplementationOnce(() => 8);
        getRandomInt.mockImplementationOnce(() => 0);

        const recommendations = [{ score: 8 }, { score: 5 }, { score: 12 }];
        const result = await sut.getRecommendation(recommendations);
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[0]);
    });
});
