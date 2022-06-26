import { MeiliSearch, SearchParams } from 'meilisearch';
import { getActiveSeason, getAllQuestions, getQuestions, getUnansweredQuestions } from 'vex-qna-archiver';

const client = new MeiliSearch({
    host: process.env.MEILI_HOST!
})

export const search = async (query: string, options: SearchParams) => {
    return client.index("question").search(query, options);
}

export const buildIndex = async () => {
    const questions = await getAllQuestions();
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
        questions = await getQuestions([season]);
    } else {
        questions = await getUnansweredQuestions();
    }

    return index.addDocuments(questions);
}

export const clearIndex = async () => {
    const index = client.index("question");
    return index.deleteAllDocuments();
}
