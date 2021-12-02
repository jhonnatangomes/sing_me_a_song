import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().required(),
    youtubeLink: Joi.string()
        .pattern(/(https:\/\/www.youtube.com\/watch\?|https:\/\/youtu.be\/).*/)
        .required(),
});

export default function isRecommendationValid(body) {
    const valid = schema.validate(body);
    if (valid.error) {
        return {
            valid: false,
            message: valid.error.message,
        };
    }
    return {
        valid: true,
        message: '',
    };
}
