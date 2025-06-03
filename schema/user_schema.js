import Joi from "joi";

export const userSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        confirmPassword: Joi.ref('password')
        
    }) .with('password', 'confirmPassword');

