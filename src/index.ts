import { config } from "dotenv";
config();

import express from 'express';
import { schedule } from "node-cron";
import { buildApplication } from "./application";
import { buildIndex, indexExists, updateIndex } from "./meili";

const app = express();




const start = async () => {
    buildApplication(app);
    const exists = await indexExists();
    if (!exists) {
        console.log("Index not found, building.")
        await buildIndex();
        console.log("Finished building index.")
    } else {
        console.log("Updating index.")
        await updateIndex(true);
        console.log("Finished updating index.");
    }
    app.listen(process.env.PORT, async () => {
        console.log(`server started on port ${process.env.PORT}`);
    });
    schedule("0 */4 * * *", async () => {
        console.log("Starting index update.");
        await updateIndex(true);
        console.log("Finished index update.")
    });
}

start();

