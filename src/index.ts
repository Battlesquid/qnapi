import { config } from "dotenv"
config();

import express from 'express';
import questionRouter from './routes/question';
import searchRouter from './routes/search';

const app = express();

app.use("/q", questionRouter);
app.use("/search", searchRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
