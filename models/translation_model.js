import { model, Schema } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";


const translationSchema = new Schema({
    inputText: { type: String },
    translatedText: { type: String },
    source_language: { type: String },
    target_language: { type: String },
    
},{
    timestamps: true
});

translationSchema.plugin(toJSON)
export const translationModel = model("Translation", translationSchema);

