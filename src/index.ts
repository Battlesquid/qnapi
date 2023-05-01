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


app.listen(process.env.PORT, async () => {
    console.log(`server started on port ${process.env.PORT}`);
    const exists = await indexExists();
    if (!exists) {
        buildIndex();
    } else {
        updateIndex(true);
    }
});

schedule("0 */4 * * *", () => {
    updateIndex(true);
});
