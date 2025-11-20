import express, { Response } from "express";
import clientSanity from "../services/sanity";

const router = express.Router();

router.get("/", async (_, response: Response) => {
    const x = await clientSanity.fetch('*[_type == "post"]');
    response.json(x);
});

module.exports = router;
