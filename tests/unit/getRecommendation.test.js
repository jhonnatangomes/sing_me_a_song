import * as recommendationsServices from '../../src/services/recommendationsServices.js';
import * as recommendationsRepositories from '../../src/repositories/recommendationsRepositories.js';
import * as helpersServices from '../../src/services/helpersServices.js';
import * as genresServices from '../../src/services/genresServices.js';

const sut = recommendationsServices;
jest.mock('../../src/helpers/getRandomInt.js');

describe('get recommendation', () => {
    const getAllRecommendations = jest.spyOn(
        helpersServices,
        'getAllRecommendations'
    );

    const getRecommendation = jest.spyOn(helpersServices, 'getRecommendation');

    const recommendations = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
    ];

    getAllRecommendations.mockImplementation(() => recommendations);
    getRecommendation.mockImplementation(() => recommendations[0]);

    it('returns random recommendation', async () => {
        const result = await sut.getRecommendation();
        expect(getRecommendation).toHaveBeenCalledWith(recommendations);
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

describe('get random recommendation by genre', () => {
    const getSongsByGenreId = jest.spyOn(genresServices, 'getSongsByGenreId');
    const getRecommendation = jest.spyOn(helpersServices, 'getRecommendation');

    it('returns recommendation by genre', async () => {
        const recommendations = {
            id: 1,
            name: 'Forr??',
            recommendations: [
                {
                    id: 2,
                    name: 'Gangnam Style',
                },
                {
                    id: 3,
                    name: 'Take me to church',
                },
            ],
        };
        getSongsByGenreId.mockImplementation(() => recommendations);
        getRecommendation.mockImplementation(
            () => recommendations.recommendations[1]
        );
        const result = await sut.getRandomRecommendationByGenre();
        expect(result).toEqual(recommendations.recommendations[1]);
        expect(getRecommendation).toHaveBeenCalledWith(
            recommendations.recommendations
        );
    });
});
