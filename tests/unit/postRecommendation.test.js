import * as recommendationsServices from '../../src/services/recommendationsServices.js';
import * as recommendationsRepositories from '../../src/repositories/recommendationsRepositories.js';

const sut = recommendationsServices;
const changeScore = jest.spyOn(recommendationsRepositories, 'changeScore');

afterEach(() => {
    changeScore.mockReset();
});

describe('insert recommendation', () => {
    changeScore.mockImplementationOnce(() => undefined);

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
        expect(insertRecomendation).not.toHaveBeenCalled();
    });

    it('should insert recommendation when it doesnt exist previously', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationByLink'
        ).mockImplementationOnce(() => false);

        await sut.insertRecommendation({ name: '', youtubeLink: '', score: 0 });
        expect(insertRecomendation).toHaveBeenCalled();
        expect(changeScore).not.toHaveBeenCalled();
    });
});

describe('vote', () => {
    const deleteRecommendation = jest
        .spyOn(recommendationsRepositories, 'deleteRecommendation')
        .mockImplementation(() => undefined);

    it('throws not found error for a non-existent id', async () => {
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => false);

        try {
            await recommendationsServices.vote();
        } catch (error) {
            expect(error.message).toEqual('This recommendation doesnt exist');
        }
    });

    it('increases score for + type', async () => {
        const recommendationObject = {
            name: 'a',
            youtube_link: 'youtube',
            score: 1,
        };
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => recommendationObject);

        await recommendationsServices.vote(1, '+');
        expect(changeScore).toHaveBeenCalledWith({
            name: recommendationObject.name,
            youtubeLink: recommendationObject.youtube_link,
            score: recommendationObject.score + 1,
        });
    });

    it('decreases score for - type and doesnt delete recommendation for score bigger than -5', async () => {
        const recommendationObject = {
            name: 'a',
            youtube_link: 'youtube',
            score: 1,
        };
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => recommendationObject);

        changeScore.mockImplementationOnce(() => {
            return { id: 25, score: -4 };
        });

        await recommendationsServices.vote(1, '-');
        expect(changeScore).toHaveBeenCalledWith({
            name: recommendationObject.name,
            youtubeLink: recommendationObject.youtube_link,
            score: recommendationObject.score - 1,
        });
        expect(deleteRecommendation).not.toHaveBeenCalled();
    });

    it('decreases score for - type and doesnt delete recommendation for score equal to -5', async () => {
        const recommendationObject = {
            name: 'a',
            youtube_link: 'youtube',
            score: 1,
        };
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => recommendationObject);

        changeScore.mockImplementationOnce(() => {
            return { id: 25, score: -5 };
        });

        await recommendationsServices.vote(1, '-');
        expect(changeScore).toHaveBeenCalledWith({
            name: recommendationObject.name,
            youtubeLink: recommendationObject.youtube_link,
            score: recommendationObject.score - 1,
        });
        expect(deleteRecommendation).not.toHaveBeenCalled();
    });

    it('decreases score for - type and deletes recommendation for score smaller than -5', async () => {
        const recommendationObject = {
            name: 'a',
            youtube_link: 'youtube',
            score: 1,
        };
        jest.spyOn(
            recommendationsRepositories,
            'getRecommendationById'
        ).mockImplementationOnce(() => recommendationObject);

        changeScore.mockImplementationOnce(() => {
            return { id: 25, score: -6 };
        });

        await recommendationsServices.vote(1, '-');
        expect(changeScore).toHaveBeenCalledWith({
            name: recommendationObject.name,
            youtubeLink: recommendationObject.youtube_link,
            score: recommendationObject.score - 1,
        });
        expect(deleteRecommendation).toHaveBeenCalled();
    });
});
