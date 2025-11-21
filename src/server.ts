import path from "path";
import * as dotenv from "dotenv";
import express, { Express, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import SpotifyWebAPI from "spotify-web-api-node";
import NodeCache from "node-cache";
import mongoose from "mongoose";
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
const DATABASE_URL: string = process.env.MONGODB_URI as string;

console.log(process.env.CLIENT_URL);
console.log(process.env.CLIENT_REDIRECT_URI);
console.log(process.env.MONGODB_URI);

export const mainConnection: mongoose.Connection = mongoose.createConnection(DATABASE_URL, {
    dbName: "gilbertrabuttsurwa",
});

mainConnection.on("connected", () => {
    console.log("Connecté");
    console.log("DB Name:", mainConnection.name);
    console.log("Host:", mainConnection.host);
    console.log("Port:", mainConnection.port);
    mongoose.set("debug", true);
});

export const auxConnection: mongoose.Connection = mongoose.createConnection(DATABASE_URL, {
    dbName: "spotify",
});

auxConnection.on("connected", () => {
    console.log("Connecté");
    console.log("DB Name:", auxConnection.name);
    console.log("Host:", auxConnection.host);
    console.log("Port:", auxConnection.port);
    mongoose.set("debug", true);
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

app.use(bodyParser.json(), cors({ origin: "*" }));
app.use("/sanity", sanityRouter);
app.use("/spotify", spotifyRouter);
app.use("/blogs", blogRouter);

app.get("/", (_, response: Response) => {
    response.send("hello world");
});

app.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
});
