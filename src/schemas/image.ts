import mongoose, { Schema, Document } from "mongoose";
import Image from "../interface/image";

const imageSchema: Schema = new mongoose.Schema<Image>({
    url: String,
    width: Number,
    height: Number,
});

export default imageSchema;
