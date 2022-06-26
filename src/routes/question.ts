import express from "express";
import { check, validationResult } from "express-validator";
import { search } from "../meilisearch/meilisearch";

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
        if(results.nbHits === 0) {
            return res.status(404).end();
        }
        res.status(200).send(results);
    })

export default questionRouter;
