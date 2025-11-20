import express, { Response } from "express";
import NodeCache from "node-cache";
import mongoose from "mongoose";
import clientSanity from "../services/sanity";
const cache = new NodeCache({
    stdTTL: 3600,
});

const router = express.Router();

router.get("/", async (_, response: Response) => {
    const x = await clientSanity.fetch('*[_type == "post"]');
    response.json(x);
});

module.exports = router;
