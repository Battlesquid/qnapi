import { config } from "dotenv"
config();

import { buildIndex, updateIndex, clearIndex } from './meilisearch';

const args = process.argv.slice(2);
switch (args[0]) {
    case "build":
        buildIndex();
        break;
    case "update":
        updateIndex(false);
        break;
    case "update_full":
        updateIndex(true);
        break;
    case "clear":
        clearIndex();
        break;
    default:
        console.log(`Unrecognized option '${args[0]}'.`);
        break;
}