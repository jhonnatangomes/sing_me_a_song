import faker from 'faker';

function recommendationsIncorrectFactory() {
    return {
        name: faker.datatype.number(),
        youtubeLink: faker.datatype.string(),
    };
}

function recommendationsFactory() {
    return {
        name: faker.datatype.string(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
            12
        )}`,
    };
}

export { recommendationsIncorrectFactory, recommendationsFactory };
