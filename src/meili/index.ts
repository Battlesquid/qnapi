import { MeiliSearch, SearchParams } from 'meilisearch';
import { getActiveSeason, getAllQuestions, getQuestions, getUnansweredQuestions } from 'vex-qna-archiver';

console.log(process.env.MEILI_MASTER_KEY)
const client = new MeiliSearch({
    host: process.env.MEILI_HOST!,
    apiKey: process.env.MEILI_MASTER_KEY!
})

export const search = async (query: string, options: SearchParams) => {
    return client.index("question").search(query, options);
}

export const indexExists = async () => {
    try {
        await client.index("question").getRawInfo();
        return true;
    } catch(e) {
        return false;
    }
}

export const buildIndex = async () => {
    const questions = await getAllQuestions(true);
    const index = client.index("question");

    await index.addDocuments(questions, { primaryKey: "id" });
    index.updateFilterableAttributes([
        "id",
        "author",
        "category",
        "answered",
        "season",
        "timestamp_ms",
        "answered",
        "tags"
    ])
}

export const updateIndex = async (fullUpdate: boolean) => {
    const index = client.index("question");
    let questions;

    if (fullUpdate) {
        const season = await getActiveSeason();
        questions = await getQuestions([season], false);
    } else {
        questions = await getUnansweredQuestions(false);
    }

    return index.addDocuments(questions);
}

export const clearIndex = async () => {
    const index = client.index("question");
    return index.deleteAllDocuments();
}

export * from "./FilterBuilder"