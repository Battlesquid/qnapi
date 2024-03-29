import { getActiveSeason } from 'vex-qna-archiver';
import { toYYYYMMDD } from "./date";

export const PER_PAGE_LIMITS = ["10", "20", "50"];

export const getDefaults = async () => {
    const season =  await getActiveSeason();
    return {
        program: ["VRC"],
        season,
        before: (time: Date) => toYYYYMMDD(time),
        after: "1970-01-01",
        page: "1",
        limit: PER_PAGE_LIMITS[0]
    }
}
