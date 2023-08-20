import { PER_PAGE_LIMITS, getDefaults } from './../util/constants';
import { fromYYYYMMDD } from './../utils';
import express, { Request } from "express";
import { check, validationResult } from 'express-validator';
import { search } from "../meili";
import { FilterBuilder } from "../meili";
import { makeEndpoint } from '@zodios/core';

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
    limit?: string
}

const searchRouter = express.Router();

export const searchQuestion = makeEndpoint({
    method: "get",
    path: "/search",
    description: "Get a question by its ID",
    response: questionSchema
})

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
    check("per_page").optional().isIn(PER_PAGE_LIMITS),
    async (req: Request<{}, {}, {}, SearchParams>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const defaults = await getDefaults();
        const search_query = req.query.search_query ?? "";
        const program = req.query.program ?? defaults.program;
        const season = req.query.season ?? defaults.season;
        const author = req.query.author ?? "";
        const before = req.query.before ?? defaults.before(new Date(Date.now()));
        const after = req.query.after ?? defaults.after;
        const answered = req.query.answered ?? "";
        const page = Math.max(parseInt(req.query.page ?? defaults.page), parseInt(defaults.page));
        const limit = Math.max(parseInt(req.query.limit ?? defaults.limit), parseInt(defaults.limit));

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
            limit: limit + 1,
            offset: limit * (page - 1)
        });

        res.status(200).send({
            data: results.hits,
            next: results.hits.length === limit + 1
        });
    })

export default searchRouter;
