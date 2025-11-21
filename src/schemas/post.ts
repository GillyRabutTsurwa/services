import mongoose, { Schema } from "mongoose";
import IPost from "../interface/post";

const postSchema: Schema = new mongoose.Schema<IPost>(
    {
        _id: { type: String },
        title: { type: String, required: true },
        _type: { type: String, required: false },
        _createdAt: { type: String, required: false },
        _updatedAt: { type: String, required: false },
        publishedAt: { type: String, required: false },
        author: { type: Object },
        excerpt: { type: String, required: false },
        mainImage: { type: Object, required: true },
        thumbnail: { type: Object, required: true },
        postGenre: { type: String, required: true },
        body: { type: [Object] },
        categories: { type: [String] },
        slug: { type: Object },
        colourPrimary: { type: Object },
        colourSecondary: { type: Object },
    },
    {
        collection: "posts",
        autoCreate: false,
    }
);

export default postSchema;
