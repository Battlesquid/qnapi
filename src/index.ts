import { config } from "dotenv"
config();

import express from 'express';
import questionRouter from './routes/question';
import searchRouter from './routes/search';
import { buildIndex, indexExists, updateIndex } from "./meili";
import { schedule } from "node-cron";

const app = express();

app.use("/q", questionRouter);
app.use("/search", searchRouter);


const start = async () => {
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

