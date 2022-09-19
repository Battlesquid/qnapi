export default class FilterBuilder {
    private programs!: string[];
    private season!: string;
    private author!: string;
    private before!: number;
    private after!: number;
    private answered!: string;

    setPrograms(programs: string[]) {
        this.programs = programs;
        return this;
    }

    setSeason(season: string) {
        this.season = season;
        return this;
    }

    setAuthor(author: string) {
        this.author = author;
        return this;
    }

    setBefore(before: number) {
        this.before = before;
        return this;
    }

    setAfter(after: number) {
        this.after = after;
        return this;
    }

    setAnswered(answered: string) {
        this.answered = answered;
        return this;
    }

    build() {
        const filters = [
            this.programs.map(p => `category = ${p}`),
            `season = ${this.season}`,
            `timestamp_ms < ${this.before}`,
            `timestamp_ms > ${this.after}`
        ]
        if (this.answered.length !== 0) {
            filters.push(`answered = ${this.answered}`);
        }
        if (this.author.length !== 0) {
            filters.push(`author = ${this.author}`);
        }
        return filters;
    }
}
