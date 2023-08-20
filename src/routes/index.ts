import { makeApi } from "@zodios/core";
import { getQuestionById } from "./question";

export const api = makeApi([
    getQuestionById,
    
])