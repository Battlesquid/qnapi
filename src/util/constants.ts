import { toYYYYMMDD } from "./date";

export const PROGRAM_DEFAULT = ["VRC"];

export const SEASON_DEFAULT = "2021-2022";

export const BEFORE_DEFAULT = (time: Date) => toYYYYMMDD(time);

export const AFTER_DEFAULT = "1970-01-01"

export const PAGE_DEFAULT = "0";

export const PER_PAGE_DEFAULT = "10";
