import express from "express";
import { check, validationResult } from "express-validator";
import { search } from "../meili";
import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { Question } from "vex-qna-archiver";
import { toZod } from "tozod";
import { zodiosApp } from "@zodios/express";

const questionSchema: toZod<Question> = z.object({
    id: z.coerce.string(),
    url: z.string(),
    author: z.string(),
    program: z.string(),
    title: z.string(),
    question: z.string(),
    questionRaw: z.string(),
    answer: z.string(),
    answerRaw: z.string(),
    season: z.string(),
    askedTimestamp: z.string(),
    askedTimestampMs: z.number(),
    answeredTimestamp: z.string(),
    answeredTimestampMs: z.number(),
    answered: z.boolean(),
    tags: z.string().array()
})

export const getQuestionById = makeEndpoint({
    method: "get",
    path: "/:id",
    description: "Get a question by its ID",
    response: questionSchema
})



const api = makeApi([
    getQuestionById,
    searchQuestion
])

const app = zodiosApp(api);

app.get("/:id", (req, res) => {
    req.params.id
    return res.json({
        id
    })
})


app.get("/search")

const questionRouter = express.Router();

questionRouter.get("/:id",
    check("id").isInt(),
    async (req: express.Request<{ id: string }>, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const results = await search("", { filter: [`id = ${req.params.id}`] });
        if (results.hits.length === 0) {
            return res.status(404).end();
        }
        res.status(200).send(results.hits[0]);
    })

export default questionRouter;
