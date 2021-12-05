import * as recommendationsServices from '../../src/services/recommendationsServices.js';
import * as recommendationsRepositories from '../../src/repositories/recommendationsRepositories.js';
import getRandomInt from '../../src/helpers/getRandomInt.js';

const sut = recommendationsServices;
jest.mock('../../src/helpers/getRandomInt.js');

describe('get recommendation', () => {
    const getAllRecommendations = jest.spyOn(
        recommendationsRepositories,
        'getAllRecommendations'
    );

    it('throws error when there are no recommendations', async () => {
        getAllRecommendations.mockImplementationOnce(() => []);

        try {
            await recommendationsServices.getRecommendation();
        } catch (error) {
            expect(error.message).toEqual('No recommendations found');
        }
    });

    it('picks a random song among all songs when there are only songs with score bigger than 10', async () => {
        const recommendations = [{ score: 12 }, { score: 15 }, { score: 18 }];
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        getRandomInt.mockImplementation(() => 0);
        const result = await sut.getRecommendation();

        expect(getRandomInt).toHaveBeenCalledWith(
            0,
            recommendations.length - 1
        );
        expect(result).toEqual(recommendations[0]);
    });

    it('picks a random song among all songs when there are only songs with score equal to or less than 10', async () => {
        const recommendations = [{ score: 8 }, { score: 10 }, { score: 9 }];
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getRecommendation();

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
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getRecommendation();
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[1]);
    });

    it('picks a random song among the ones with score bigger than 10 for percentage equal to 7', async () => {
        getRandomInt.mockImplementationOnce(() => 7);
        getRandomInt.mockImplementationOnce(() => 0);

        const recommendations = [{ score: 8 }, { score: 11 }, { score: 12 }];
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getRecommendation();
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[1]);
    });

    it('picks a random song among the ones with score less than or equal to 10 for percentage equal to 8', async () => {
        getRandomInt.mockImplementationOnce(() => 8);
        getRandomInt.mockImplementationOnce(() => 0);

        const recommendations = [{ score: 8 }, { score: 5 }, { score: 12 }];
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getRecommendation();
        expect(getRandomInt).toHaveBeenLastCalledWith(0, 1);
        expect(result).toEqual(recommendations[0]);
    });
});

describe('get top recommendations', () => {
    const getTopRecommendations = jest.spyOn(
        recommendationsRepositories,
        'getAllRecommendations'
    );

    it('throws an error for no recomendations in database', async () => {
        getTopRecommendations.mockImplementationOnce(() => []);
        try {
            await sut.getTopRecommendations();
        } catch (error) {
            expect(error.message).toEqual('No recommendations found');
        }
    });

    it('returns recommendations for recommendations in database', async () => {
        const recommendations = [
            {
                id: 12,
                name: 'Falamansa - Xote dos Milagres',
                youtubeLink:
                    'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
                score: 112,
            },
        ];
        getTopRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getTopRecommendations();
        expect(result).toEqual(recommendations);
    });
});
