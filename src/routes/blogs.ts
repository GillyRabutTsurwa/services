import express, { Request, Response, Router } from "express";
import Post from "../models/post";
const router: Router = express.Router();

router.get("/", async (_, response: Response) => {
    const posts = await Post.find();
    response.json(posts);
});

export default router;
