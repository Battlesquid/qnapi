import { config } from "dotenv"
config();

import express from 'express';
import questionRouter from './routes/question';
import searchRouter from './routes/search';

const app = express();

app.use("/q", questionRouter);
app.use("/search", searchRouter);

app.listen(process.env.QNAPI_PORT, () => console.info("server started."));
