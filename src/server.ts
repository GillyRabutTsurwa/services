import path from "path";
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import SpotifyWebAPI from "spotify-web-api-node";
import NodeCache from "node-cache";
import mongoose from "mongoose";
import { instantiateSpotify } from "./functions/spotify";

dotenv.config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app: Express = express();
const spotify = require("./routes/spotify");
const blogs = require("./routes/blogs");
const PORT: number | string = process.env.PORT || 4242;
const cache = new NodeCache({
    stdTTL: 3600,
});
const DATABASE_URL: string = process.env.MONGODB_URI as string;

console.log(process.env.CLIENT_URL);
console.log(process.env.CLIENT_REDIRECT_URI);
console.log(process.env.MONGODB_URI);

(async () => {
    try {
        const dbServer = await mongoose.connect(DATABASE_URL, {
            dbName: "gilbertrabuttsurwa",
        });
        // console.log(`Connected to the ${dbServer.connection.db.databaseName} database @ host ${dbServer.connection.host}`);
        console.log(`Connected ... database @ host ${dbServer.connection.host}`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.set("debug", true);
    }
})();

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

app.use(
    // bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    cors({
        origin: "*",
    })
);

app.use("/spotify", spotify);
app.use("/blogs", blogs);

app.get("/", (request: Request, response: Response) => {
    response.send("hello world");
});

// =================================================================================================

app.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
});
