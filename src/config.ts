export const id = "markdown-plugin" as const;

export const defaults: PluginConfig = {
    renderEverything: false,
    markdownFlags: "<md>,<markdown>",
};
export function getPluginConfig(config: Config | undefined) {
    return Object.assign({}, defaults, config?.[id] || {});
}

export interface PluginConfig {
    renderEverything: boolean;
    markdownFlags: string;
}
export type Config = {
    [X in typeof id]?: Partial<PluginConfig>;
};
