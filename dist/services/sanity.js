"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@sanity/client");
const sanityClient = (0, client_1.createClient)({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_ENV,
    apiVersion: process.env.SANITY_API_VERSION,
    useCdn: false,
});
exports.default = sanityClient;
