import { fromYYYYMMDD } from './../util/date';
import express, { Request } from "express";
import { check, validationResult } from 'express-validator';
import { search } from "../meilisearch/meilisearch";
import FilterBuilder from "../meilisearch/FilterBuilder";
import {
    AFTER_DEFAULT,
    BEFORE_DEFAULT,
    PAGE_DEFAULT,
    PER_PAGE_DEFAULT,
    PROGRAM_DEFAULT,
    SEASON_DEFAULT
} from '../util/constants';

type SearchParams = {
    search_query: string
    program?: string[] | string
    season?: string
    author?: string
    before?: string
    after?: string
    tags?: string[]
    answered?: string
    page?: string
    per_page?: string
}

const searchRouter = express.Router();

searchRouter.get("/",
    check("search_query").optional(),
    check("program.*").optional().isIn(["VRC", "VEXU", "VIQC", "VAICHS", "VAICU", "RADC", "Judging"]),
    check("season").optional().custom(param => {
        const match = param.match(/(?<start>\d{4})-(?<end>\d{4})/);
        if (!match) {
            throw new Error("Invalid season format, must be in the format YYYY-YYYY")
        }
        const start = parseInt(match.groups.start), end = parseInt(match.groups.end);
        if (end - start !== 1) {
            throw new Error("Invalid season years, must be in the format 'StartYear-EndYear', where EndYear is 1 year ahead of StartYear")
        }
        return true;
    }),
    check("author").optional(),
    check("before").optional().isDate(),
    check("after").optional().isDate(),
    check("answered").optional().isBoolean(),
    check("page").optional().isInt(),
    check("per_page").optional().isInt(),
    async (req: Request<{}, {}, {}, SearchParams>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const search_query = req.query.search_query ?? "";
        const program = req.query.program ?? PROGRAM_DEFAULT;
        const season = req.query.season ?? SEASON_DEFAULT;
        const author = req.query.author ?? "";
        const before = req.query.before ?? BEFORE_DEFAULT(new Date(Date.now()));
        const after = req.query.after ?? AFTER_DEFAULT;
        const answered = req.query.answered ?? "";
        const page = parseInt(req.query.page ?? PAGE_DEFAULT);
        const per_page = parseInt(req.query.per_page ?? PER_PAGE_DEFAULT);

        const programs = Array.isArray(program)
            ? program
            : [program];

        const filter = new FilterBuilder()
            .setPrograms(programs)
            .setSeason(season)
            .setAuthor(author)
            .setBefore(fromYYYYMMDD(before).getTime())
            .setAfter(fromYYYYMMDD(after).getTime())
            .setAnswered(answered)
            .build();

        const results = await search(search_query, {
            filter,
            offset: page * per_page,
            limit: per_page
        });

        res.status(200).send(results);
    })

export default searchRouter;
