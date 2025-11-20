import express, { Request, Response, Router } from "express";
import Post from "../models/post";
import { createPost, updatePost } from "../functions/posts";
const router: Router = express.Router();

// sanity webhook
router.post("/", async (request: Request, response: Response) => {
    try {
        const headers = request.headers;
        const post = request.body;

        console.log("Sanity webhook reçu:");
        if (headers["sanity-operation"] === "create") {
            await Post.findByIdAndDelete(headers["sanity-document-id"]);
            console.log(`Adding new post with id: ${headers["sanity-document-id"]}`);
            await createPost(post);
        } else if (headers["sanity-operation"] === "update") {
            const existingPost = await Post.findById(headers["sanity-document-id"]);
            if (!existingPost) {
                await createPost(post);
            } else {
                console.log(`Updating body of post with id: ${headers["sanity-document-id"]}`);
                await updatePost(post, headers["sanity-document-id"]);
            }
        } else if (headers["sanity-operation"] === "delete") {
            console.log(`Deleting post with id: ${headers["sanity-document-id"]}`);
            await Post.findByIdAndDelete(headers["sanity-document-id"]);
        } else {
            console.error("On peut pas le faire");
        }
        return response.status(200).json({ ok: true });
    } catch (error) {
        return response.status(500).json({ error: "Server erreur" });
    }
});

export default router;
