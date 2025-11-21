import mongoose, { Schema } from "mongoose";
import trackSchema from "../schemas/track";
import ITrack from "../interface/track";

const Track = mongoose.model<ITrack>("Track", trackSchema);
export default Track;
