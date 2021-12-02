import * as recommendationsServices from '../../../src/services/recommendationsServices.js';
import * as recommendationsRepositories from '../../../src/repositories/recommendationsRepositories.js';
import APIError from '../../../src/errors/APIError.js';

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

describe('upvote', () => {
    it('throws not found error for a non-existent id', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => false);

        try {
            await recommendationsServices.upVote();
        } catch (error) {
            expect(error.message).toEqual('This recommendation doesnt exist');
        }
    });

    it('changes score for an existent id', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => true);

        const changeScore = jest
            .spyOn(recommendationsRepositories, 'changeScore')
            .mockImplementationOnce(() => undefined);

        await recommendationsServices.upVote();
        expect(changeScore).toHaveBeenCalled();
    });
});
