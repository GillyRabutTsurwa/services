import { auxConnection } from "../connections";
import playlistSchema from "../schemas/playlist";
import IPlaylist from "../interface/playlist";

const Playlist = auxConnection.model<IPlaylist>("Playlist", playlistSchema);
export default Playlist;
