import { mainConnection } from "../connections";
import postSchema from "../schemas/post";
import IPost from "../interface/post";

const Post = mainConnection.model<IPost>("Post", postSchema);
export default Post;
