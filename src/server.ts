import path from "path";
import * as dotenv from "dotenv";
import express, { Express, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import SpotifyWebAPI from "spotify-web-api-node";
import NodeCache from "node-cache";
import mongoose from "mongoose";
import "./connections"; // démarre les connexions
import { instantiateSpotify } from "./functions/spotify";

import blogRouter from "./routes/blogs";
import sanityRouter from "./routes/sanity";
import spotifyRouter from "./routes/spotify";

dotenv.config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app: Express = express();
const PORT: number | string = process.env.PORT || 4242;
const cache = new NodeCache({
    stdTTL: 3600,
});

// Cached Token Handling
cache.on("expired", async (key: string, value: string) => {
    if (key === "accessToken") {
        console.log(`${key} key is expired`);
        const refreshToken = cache.get("refreshToken") as string;
        const spotifyAPI: SpotifyWebAPI = instantiateSpotify();
        spotifyAPI.setRefreshToken(refreshToken);

        try {
            const tokenResponse = await spotifyAPI.refreshAccessToken();
            const data = tokenResponse.body;
            console.log(data);
            value = data.access_token;
            cache.set("accessToken", value);
        } catch (err) {
            console.error("Could not refresh accesss token", err);
        } finally {
            console.log("Done attempting access token refresh");
        }
    }
});

console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
    case "development":
    case "production":
        app.use(bodyParser.json(), cors({ origin: "*" }));
        break;
    case "testing":
        app.use(bodyParser.urlencoded({ extended: true }), cors({ origin: "*" }));
        break;
    default:
        console.error("node environment variable has been improperly set");
}

app.use("/sanity", sanityRouter);
app.use("/spotify", spotifyRouter);
app.use("/blogs", blogRouter);

app.get("/", (_, response: Response) => {
    response.send("hello world");
});

app.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
});
