import * as genresServices from '../../src/services/genresServices.js';
import * as genresRepositories from '../../src/repositories/genresRepositories.js';
import * as recommendationsRepositories from '../../src/repositories/recommendationsRepositories.js';
import APIError from '../../src/errors/APIError.js';

const sut = genresServices;

describe('create genre', () => {
    const getGenreByName = jest.spyOn(genresRepositories, 'getGenreByName');
    it('throws conflict error when genre already exists', async () => {
        getGenreByName.mockImplementationOnce(() => true);

        const result = sut.createGenre();
        await expect(result).rejects.toThrow(APIError);
    });

    it('inserts genre when it doesnt exist on database', async () => {
        getGenreByName.mockImplementationOnce(() => false);
        const insertGenre = jest
            .spyOn(genresRepositories, 'insertGenre')
            .mockImplementationOnce(() => undefined);

        await sut.createGenre();
        expect(insertGenre).toHaveBeenCalled();
    });
});

describe('get genres', () => {
    const getAllGenres = jest.spyOn(genresRepositories, 'getAllGenres');

    it('throws not found error when there are no genres', async () => {
        getAllGenres.mockImplementationOnce(() => []);

        const result = sut.getGenres();
        await expect(result).rejects.toThrow(APIError);
    });

    it('returns genres when there are genres', async () => {
        const genres = [
            {
                id: 1,
                name: 'Forró',
            },
            {
                id: 2,
                name: 'Rock',
            },
        ];
        getAllGenres.mockImplementationOnce(() => genres);
        const result = await sut.getGenres();
        expect(result).toEqual(genres);
    });
});

describe('check if genres exist', () => {
    const getAllGenres = jest.spyOn(genresRepositories, 'getAllGenres');
    const genres = [
        {
            id: 1,
            name: 'Forró',
        },
        {
            id: 2,
            name: 'Metal',
        },
    ];
    getAllGenres.mockImplementation(() => genres);

    it('throws error if at least one genre doesnt exist', async () => {
        const result = sut.checkIfGenresExist([1, 2, 3]);
        await expect(result).rejects.toThrow(APIError);
    });

    it('doesnt throw error if all genres exist', async () => {
        const result = await sut.checkIfGenresExist([1, 2]);
        expect(result).toEqual(undefined);
    });
});

describe('set genres to recommendations', () => {
    const setGenresToRecommendation = jest.spyOn(
        genresRepositories,
        'setGenresToRecommendation'
    );

    setGenresToRecommendation.mockImplementation(() => undefined);
    it('sets genres to recommendations', async () => {
        await sut.setGenresToRecommendation({
            recommendationId: 1,
            genresIds: [1, 2, 3],
        });
        expect(setGenresToRecommendation).toHaveBeenCalledWith({
            genresIds: [1, 2, 3],
            recommendationId: 1,
        });
    });
});

describe('get songs by genre id', () => {
    const getAllRecommendations = jest.spyOn(
        recommendationsRepositories,
        'getAllRecommendations'
    );

    it('throws error if there are no recommendations', async () => {
        getAllRecommendations.mockImplementationOnce(() => []);
        const result = sut.getSongsByGenreId();
        await expect(result).rejects.toThrow(APIError);
    });

    it('throws error if there are no recommendations with the given genre', async () => {
        getAllRecommendations.mockImplementationOnce(() => [
            {
                id: 1,
                genres: [
                    {
                        id: 1,
                    },
                ],
            },
        ]);
        const result = sut.getSongsByGenreId(2);
        await expect(result).rejects.toThrow(APIError);
    });

    it('returns formatted object when there are recommendations with the given genre', async () => {
        const recommendations = [
            {
                id: 1,
                score: 10,
                genres: [
                    {
                        id: 1,
                    },
                ],
            },
            {
                id: 2,
                score: 5,
                genres: [
                    {
                        id: 1,
                    },
                ],
            },
            {
                id: 3,
                score: 10,
                genres: [
                    {
                        id: 2,
                    },
                ],
            },
        ];

        jest.spyOn(
            genresRepositories,
            'getGenreNameById'
        ).mockImplementationOnce(() => 'Forró');
        getAllRecommendations.mockImplementationOnce(() => recommendations);
        const result = await sut.getSongsByGenreId(1);
        expect(result).toEqual({
            id: 1,
            name: 'Forró',
            score: 15,
            recommendations: [recommendations[0], recommendations[1]],
        });
    });
});
