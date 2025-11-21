import { auxConnection } from "../connections";
import playlistSchema from "../schemas/playlist";
import IPlaylist from "../interface/playlist";

export const Playlist = auxConnection.model<IPlaylist>("Playlist", playlistSchema);
