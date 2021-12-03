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
