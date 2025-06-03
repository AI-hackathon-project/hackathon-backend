import { model, Schema } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";


const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username:{type: String, lowercase:true, unique: true},    
    email: {type: String},
    password:{type: String}
},{
    timestamps:true
});

userSchema.plugin(toJSON);
export const userModel = model("User", userSchema);