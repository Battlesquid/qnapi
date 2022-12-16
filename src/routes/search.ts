import { getDefaults } from './../util/constants';
import { fromYYYYMMDD } from './../util/date';
import express, { Request } from "express";
import { check, validationResult } from 'express-validator';
import { search } from "../meilisearch/meilisearch";
import FilterBuilder from "../meilisearch/FilterBuilder";

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
    check("per_page").optional().isIn(["10", "20", "50"]),
    async (req: Request<{}, {}, {}, SearchParams>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const defaults = await getDefaults()
        const search_query = req.query.search_query ?? "";
        const program = req.query.program ?? defaults.program;
        const season = req.query.season ?? defaults.season;
        const author = req.query.author ?? "";
        const before = req.query.before ?? defaults.before(new Date(Date.now()));
        const after = req.query.after ?? defaults.after;
        const answered = req.query.answered ?? "";
        const page = parseInt(req.query.page ?? defaults.page);
        const per_page = parseInt(req.query.per_page ?? defaults.perPage);

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
            page,
            hitsPerPage: per_page
        });

        const response = {
            meta: {
                prev_page: Math.max(results.page! - 1, 1),
                next_page: Math.min(results.page! + 1, results.totalPages!),
                last_page: results.totalPages!
            },
            data: results.hits
        }

        res.status(200).send(response);
    })

export default searchRouter;
