import * as recommendationsServices from '../../../src/services/recommendationsServices.js';
import * as recommendationsRepositories from '../../../src/repositories/recommendationsRepositories.js';

const sut = recommendationsServices;

describe('insert recommendation', () => {
    const changeScore = jest
        .spyOn(recommendationsRepositories, 'changeScore')
        .mockImplementationOnce(() => undefined);
    const insertRecomendation = jest
        .spyOn(recommendationsRepositories, 'insertRecommendation')
        .mockImplementationOnce(() => undefined);

    it('should increase score when recommendation already exists', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationByLink'
        ).mockImplementationOnce(() => true);

        await sut.insertRecommendation({ name: '', youtubeLink: '', score: 0 });
        expect(changeScore).toHaveBeenCalled();
    });

    it('should insert recommendation when it doesnt exist previously', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationByLink'
        ).mockImplementationOnce(() => false);

        await sut.insertRecommendation({ name: '', youtubeLink: '', score: 0 });
        expect(insertRecomendation).toHaveBeenCalled();
    });
});
