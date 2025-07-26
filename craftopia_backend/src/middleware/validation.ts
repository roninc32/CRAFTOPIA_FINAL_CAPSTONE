import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim(),
    email: Joi.string()
        .email()
        .required()
        .trim(),
    password: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
});

export const loginSchema = Joi.object({
    username: Joi.string()
        .required()
        .trim(),
    password: Joi.string()
        .required()
});

export const verifyEmailSchema = Joi.object({
    token: Joi.string()
        .required()
});
