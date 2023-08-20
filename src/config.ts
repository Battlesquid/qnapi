const VARIABLES = [
    "MEILI_HOST",
    "MEILI_MASTER_KEY"
] as const;

type ConfigVariable = typeof VARIABLES[number];

const loadConfig = () => {
    const loaded: Record<string, string> = {};
    VARIABLES.forEach((v) => {
        const value = process.env[v];
        if (value === undefined) {
            throw Error(`Environment variable '${v}' missing, exiting.`);
        }
        loaded[v] = value;
    });
    return loaded;
}

let config: Record<string, string> | null = null;

export default (key: ConfigVariable) => {
    if (config === null) {
        config = loadConfig();
    }
    return config[key];
}