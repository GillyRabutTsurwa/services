import mongoose, { Schema, Document } from "mongoose";
import imageSchema from "./image";
import userSchema from "./user";
import Playlist from "../interface/playlist";

const playlistSchema: Schema = new mongoose.Schema<Playlist>({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    images: {
        type: [imageSchema],
        required: false,
    },
    owner: {
        type: userSchema,
        required: false,
    },
});

export default playlistSchema;
