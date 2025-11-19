import { createClient } from "@sanity/client";

const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_ENV,
    apiVersion: process.env.SANITY_API_VERSION,
    useCdn: false,
});

export default sanityClient;
