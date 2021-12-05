import * as genresServices from '../../src/services/genresServices.js';
import * as genresRepositories from '../../src/repositories/genresRepositories.js';
import APIError from '../../src/errors/APIError.js';

const sut = genresServices;

describe('create genre', () => {
    const getGenreByName = jest.spyOn(genresRepositories, 'getGenreByName');
    it('throws conflict error when genre already exists', async () => {
        getGenreByName.mockImplementationOnce(() => true);
        try {
            await sut.createGenre();
        } catch (error) {
            expect(error.message).toEqual('Genre already exists');
        }
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
        try {
            await sut.getGenres();
        } catch (error) {
            expect(error.message).toEqual('No genres in database');
        }
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
