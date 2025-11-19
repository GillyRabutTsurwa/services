import path from "path";
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import SpotifyWebAPI from "spotify-web-api-node";
import NodeCache from "node-cache";
import mongoose from "mongoose";

const router = express.Router();

router.get("/hello", (request: Request, response: Response) => {
    response.send("wax on wax off skjhjkettings");
});

module.exports = router;
