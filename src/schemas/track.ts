import mongoose, { Schema } from "mongoose";
import Track from "../interface/track";
import AlbumCover from "../interface/albumcover";

const trackSchema: Schema = new mongoose.Schema<Track>({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
    album: {
        name: String,
        images: Array<AlbumCover>,
    },
});

export default trackSchema;
