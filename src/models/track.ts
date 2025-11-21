import { auxConnection } from "../connections";
import trackSchema from "../schemas/track";
import ITrack from "../interface/track";

const Track = auxConnection.model<ITrack>("Track", trackSchema);
export default Track;
