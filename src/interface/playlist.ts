import Image from "./image";
import User from "./user";

interface IPlaylist {
    _id: string;
    name: string;
    description: string;
    images: Array<Image>;
    owner: User;
    public: boolean;
    type: string;
    uri: string;
}

export default IPlaylist;
