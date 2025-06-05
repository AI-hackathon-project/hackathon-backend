import Joi from "joi";

export const translationSchema = Joi.object({
    text: Joi.string().min(2).required(),
    source_language: Joi.string().valid("en", "tw", "gaa", "ee", "fat", "dag").required(),
    target_language: Joi.string().valid("en", "tw", "gaa", "ee", "fat", "dag").required()
});
