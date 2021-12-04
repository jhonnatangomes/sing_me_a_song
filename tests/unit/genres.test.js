import * as genresServices from '../../src/services/genresServices.js';
import * as genresRepositories from '../../src/repositories/genresRepositories.js';

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
