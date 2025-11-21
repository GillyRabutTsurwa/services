import path from "path";
import connectionDB from "./mongo";
import * as dotenv from "dotenv";
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

console.log(process.cwd()); //possible solution to make path definition easier. also in server.ts

const DATABASE_URL: string = process.env.MONGODB_URI as string;
console.log(DATABASE_URL);

export const mainConnection = connectionDB(DATABASE_URL, "gilbertrabuttsurwa");
export const auxConnection = connectionDB(DATABASE_URL, "spotify");
