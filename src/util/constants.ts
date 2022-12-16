import { getActiveSeason } from 'vex-qna-archiver';
import { toYYYYMMDD } from "./date";

export const getDefaults = async () => {
    const season =  await getActiveSeason();
    return {
        program: ["VRC"],
        season,
        before: (time: Date) => toYYYYMMDD(time),
        after: "1970-01-01",
        page: "1",
        perPage: "10"
    }
}
