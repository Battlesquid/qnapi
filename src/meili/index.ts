import { MeiliSearch, SearchParams } from 'meilisearch';
import { Question, getAllQuestions, getQuestions, getUnansweredQuestions } from 'vex-qna-archiver';
import config from '../config';

let client: MeiliSearch | null = null;

const getClient = () => {
    if (client === null) {
        client = new MeiliSearch({
            host: config("MEILI_HOST"),
            apiKey: config("MEILI_MASTER_KEY")
        });
    }
    return client;
}

const getQuestionIndex = () => {
    return getClient().index<Question>("question");
}

export const search = async (query: string, options: SearchParams) => {
    return getQuestionIndex().search(query, options);
}

export const indexExists = async () => {
    try {
        await getQuestionIndex().getRawInfo();
        return true;
    } catch (e) {
        return false;
    }
}

export const buildIndex = async () => {
    const questions = await getAllQuestions();
    const index = getQuestionIndex();

    await index.addDocuments(questions, { primaryKey: "id" });
    return index.updateFilterableAttributes([
        "id",
        "author",
        "program",
        "answered",
        "season",
        "timestamp_ms",
        "answered",
        "tags"
    ])
}

export const updateIndex = async (fullUpdate: boolean) => {
    const questions = fullUpdate
        ? await getQuestions()
        : await getUnansweredQuestions();

    return getQuestionIndex().addDocuments(questions);
}

export const clearIndex = () => {
    return getQuestionIndex().deleteAllDocuments();
}

export * from "./FilterBuilder";
