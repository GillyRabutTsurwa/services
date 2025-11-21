import mongoose, { Schema, Document } from "mongoose";
import User from "../interface/user";

const userSchema: Schema = new mongoose.Schema<User>({
    _id: String,
    name: String,
    url: String,
    type: String,
    uri: String,
});

export default userSchema;
