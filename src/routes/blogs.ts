import express, { Request, Response } from "express";
import Post from "../models/post";
import IPost from "../interface/post";

const router = express.Router();

router.get("/", async (_, response: Response) => {
    const posts = await Post.find();
    response.json(posts);
});

// sanity webhook
router.post("/", async (request: Request, response: Response) => {
    const createPost = async (post: IPost) => {
        await Post.create({
            _id: post._id,
            title: post.title,
            _type: post._type,
            _createdAt: post._createdAt,
            _updatedAt: post._updatedAt,
            publishedAt: post.publishedAt,
            author: post.author,
            excerpt: post.excerpt,
            mainImage: post.mainImage,
            thumbnail: post.thumbnail,
            postGenre: post.postGenre,
            body: post.body,
            categories: post.categories,
            slug: post.slug,
            colourPrimary: post.colourPrimary,
            colourSecondary: post.colourSecondary,
        });
    };

    const updatePost = async (post: IPost, postID?: IPost["_id"]) => {
        await Post.findByIdAndUpdate(postID, {
            title: post.title,
            _type: post._type,
            _updatedAt: post._updatedAt,
            publishedAt: post.publishedAt,
            excerpt: post.excerpt,
            mainImage: post.mainImage,
            thumbnail: post.thumbnail,
            postGenre: post.postGenre,
            body: post.body,
            categories: post.categories,
            slug: post.slug,
            colourPrimary: post.colourPrimary,
            colourSecondary: post.colourSecondary,
        });
    };

    const headers = request.headers;
    const post = request.body;

    console.log("Sanity webhook reçu:");
    console.log(headers);
    console.log("-----------");
    console.log(post);
    if (headers["sanity-operation"] === "create") {
        // await Post.findByIdAndDelete(headers["sanity-document-id"]);
        console.log(`Adding new post with id: ${headers["sanity-document-id"]}`);
        // await createPost(post);
    } else if (headers["sanity-operation"] === "update") {
        // const existingPost = await Post.findById(headers["sanity-document-id"]);
        // if (!existingPost) {
        //     await createPost(post);
        // } else {
        //     console.log(`Updating body of post with id: ${headers["sanity-document-id"]}`);
        //     await updatePost(post, headers["sanity-document-id"]);
        // }
    } else if (headers["sanity-operation"] === "delete") {
        console.log(`Deleting post with id: ${headers["sanity-document-id"]}`);
        // await Post.findByIdAndDelete(headers["sanity-document-id"]);
    } else {
        console.error("On peut pas le faire");
    }
    console.log("======================================");
    console.log("======================================");
    console.log("======================================");
    console.log(post);
});

module.exports = router;
