import express, { Request, Response, Router } from "express";
import SpotifyWebAPI from "spotify-web-api-node";
import NodeCache from "node-cache";
import { instantiateSpotify } from "../functions/spotify";
import { Afrique, House, Favourites, Vapourwave } from "../models/track";
import { Playlist } from "../models/playlist";
import { populatePlaylist } from "../functions/playlists";
import { populateFavourites } from "../functions/favourites";

const cache = new NodeCache({
    stdTTL: 3600,
});

const router: Router = express.Router();

router.get("/", (_, response: Response) => {
    response.send("Spotify Settings Una");
});

// Authorisation & Token Handling

router.get("/authorisation", (_, response: Response) => {
    const redirectURL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.CLIENT_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing`;

    response.json({
        url: redirectURL,
    });
});

router.post("/login", async (request: Request, response: Response) => {
    const code: string = request.body.code;
    const spotifyAPI: SpotifyWebAPI = instantiateSpotify();

    try {
        const authResponse = await spotifyAPI.authorizationCodeGrant(code);
        const data = authResponse.body;
        console.log(data);
        cache.set("accessToken", data.access_token);
        cache.set("refreshToken", data.refresh_token, 0);
        cache.set("expiresIn", data.expires_in, 0);
        const tokenAccess = cache.get("accessToken");
        const tokenRefresh = cache.get("refreshToken");
        const tokenExpire = cache.get("expiresIn");
        console.log(`AccessToken in Cache: ${tokenAccess}`);
        console.log(`RefreshToken in Cache: ${tokenRefresh}`);
        console.log(`ExpirationToken in Cache: ${tokenExpire}`);

        response.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
        });
    } catch (err) {
        console.error("Could not refresh accesss token", err);
    } finally {
        console.log("Done retrieval attempt of access token");
    }
});

router.get("/refresh", (_, response: Response) => {
    const accessToken = cache.get("accessToken");
    const expiresIn = cache.get("expiresIn");

    response.json({
        accessToken: accessToken,
        expiresIn: expiresIn,
    });
});

// Get my info

router.get("/me", async (request: Request, response: Response) => {
    const accessToken: string | undefined = cache.get("accessToken") as string;
    if (!accessToken) {
        response.status(401).json({ error: "Access Token Not Found In These Skreetz" });
        return;
    }
    const spotifyAPI: SpotifyWebAPI = instantiateSpotify();
    spotifyAPI.setAccessToken(accessToken);
    try {
        const réponse = await spotifyAPI.getMe();
        const myInfo = réponse.body;
        console.clear();
        console.log(myInfo);
        response.status(200).json(myInfo);
    } catch (err) {
        response.status(400).json({ error: "Something went wrong" });
    }
});

// Get user info

router.get("/:user", async (request: Request, response: Response) => {
    const user = request.params.user;
    const accessToken: string | undefined = cache.get("accessToken") as string;
    if (!accessToken) {
        response.status(401).json({ error: "Access Token Not Found In These Skreetz" });
        return;
    }
    const spotifyAPI: SpotifyWebAPI = instantiateSpotify();
    spotifyAPI.setAccessToken(accessToken);
    try {
        const réponse = await spotifyAPI.getUser(user);
        const myInfo = réponse.body;
        response.status(200).json(myInfo);
    } catch (err) {
        response.status(400).json({ error: "Something went wrong" });
    }
});

// ================================================================================================

// Track Management

router.post("/playlists", async (request: Request, response: Response) => {
    const user = request.body.user;
    const accessToken: string | undefined = cache.get("accessToken") as string;
    if (!accessToken) {
        response.status(401).json({ error: "Access Token Not Found In These Skreetz" });
        return;
    }
    const spotifyAPI: SpotifyWebAPI = instantiateSpotify();
    spotifyAPI.setAccessToken(accessToken);

    try {
        const réponse = await spotifyAPI.getUserPlaylists(user);
        const playlists = réponse.body.items;

        if (user !== "tsurwagilly") {
            // NOTE: si je suis pas le user, ne pas essayer de mettre les playlists dans le bases de données
            response.status(200).json(playlists);
            return;
        }

        playlists.forEach(async (currentPlaylist) => {
            const existingPlaylist = await Playlist.findOne({ _id: currentPlaylist.id });
            if (existingPlaylist) return;
            try {
                await Playlist.create({
                    _id: currentPlaylist.id,
                    name: currentPlaylist.name,
                    description: currentPlaylist.description,
                    images: currentPlaylist.images,
                    owner: {
                        id: currentPlaylist.owner.id,
                        name: currentPlaylist.owner.display_name,
                        url: currentPlaylist.owner.external_urls.spotify,
                        type: currentPlaylist.owner.type,
                        uri: currentPlaylist.owner.uri,
                    },
                });
            } catch (err) {
                console.error(err);
            } finally {
                console.log("Done");
            }
        });
        const dbPlaylists = await Playlist.find();
        // response.status(200).json(dbPlaylists); //NOTE ceci derange les chose ches la client
        response.status(200).json(playlists);
    } catch (error) {
        response.status(400).json({ error: "Something went wrong" });
    }
});

router.post("/playlist", async (request: Request, response: Response) => {
    const playlistID = request.body.playlistID;
    const accessToken: string | undefined = cache.get("accessToken") as string;
    if (!accessToken) {
        response.status(401).json({ error: "Access Token Not Found In These Skreetz" });
        return;
    }
    const spotifyAPI: SpotifyWebAPI = instantiateSpotify();
    spotifyAPI.setAccessToken(accessToken);

    try {
        const réponse = await spotifyAPI.getPlaylistTracks(playlistID);
        const tracks = réponse.body.items;
        response.status(200).json(tracks);
    } catch (err) {
        response.status(400).json({ error: err });
    }
});

router.get("/playlists/afrique", async (_, response: Response) => {
    const songs = await Afrique.find();
    await populatePlaylist(response, cache, "1x1JZBiYCWxOcinqkZnhGO", Afrique, songs);
});

router.get("/playlists/house", async (_, response: Response) => {
    const songs = await House.find();
    await populatePlaylist(response, cache, "6Fbu37ReQN0o2As9AAjMsy", House, songs);
});

router.get("/playlists/vapourwave", async (_, response: Response) => {
    const songs = await Vapourwave.find();
    await populatePlaylist(response, cache, "4E7Vswz1uCbsSyh3VF7Dj2", Vapourwave, songs);
});

router.get("/playlists/liked", async (_, response: Response) => {
    const songs = await Favourites.find();
    await populateFavourites(response, cache, Favourites, songs);
});

export default router;
