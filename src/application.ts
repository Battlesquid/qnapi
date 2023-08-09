import compression from "compression"
import { Express } from "express"
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import questionRouter from "./routes/question";
import searchRouter from "./routes/search";

export const buildApplication = (app: Express) => {
    app.use(compression());
    app.use(helmet());
    app.use(pinoHttp());
    app.use("/q", questionRouter);
    app.use("/search", searchRouter);
}