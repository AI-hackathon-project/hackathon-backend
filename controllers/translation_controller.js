import axios from "axios";
import "dotenv/config";
import { translationSchema } from "../schema/translation_schema.js";
import { translationModel } from "../models/translation_model.js";

export const translateText = async (req, res) => {
    const { error, value } = translationSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { text, source_language, target_language } = value;

    try {
        const response = await axios.post(
            "https://translation-api.ghananlp.org",
            {
                text,
                source_lang: source_language,
                target_lang: target_language
            }
        );


        const { translated_text } = response.data;

        await translationModel.create({
            inputText: text,
            translatedText: translated_text,
            sourceLang,
            targetLang
        });

        return res.status(200).json({
            message: "Translation successful",
            translatedText: translated_text
        });

    } catch (err) {
        return res.status(500).send("Translation failed: " + err.message);
    }
};
