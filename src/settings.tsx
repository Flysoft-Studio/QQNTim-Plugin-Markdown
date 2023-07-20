import { usePluginConfig } from "./utils/hooks";
import { defineSettingsPanels } from "qqntim-settings";
import { Input, SettingsBox, SettingsBoxItem, SettingsSection, Switch } from "qqntim-settings/components";
import { env } from "qqntim/renderer";
import { useMemo } from "react";
import { getPluginConfig } from "./config";

export default class Entry implements QQNTim.Entry.Renderer {
    constructor() {
        // 如果不需要设置界面，将下一行注释掉即可；如果需要在设置项目旁边加一个小图标，请将 `undefined` 改为一段 HTML 代码（可以是 `<svg>`, `<img>` 等等）。
        defineSettingsPanels(["Markdown 渲染插件", SettingsPanel, undefined]);
    }
}

function SettingsPanel({ config: _config, setConfig: _setConfig }: QQNTim.Settings.PanelProps) {
    const [pluginConfig, setPluginConfig] = usePluginConfig(_config, _setConfig);
    const currentPluginConfig = useMemo(() => getPluginConfig(env.config.plugins.config), []);

    return (
        <>
            <SettingsSection title="使用方法">
                <SettingsBox>
                    <SettingsBoxItem title="Markdown 消息" description={[`在消息头部插入 ${currentPluginConfig.markdownFlags.split(",").join(" 或 ")} 即可使用 Markdown 渲染你的消息。`]} />
                    <SettingsBoxItem title="LaTeX 渲染" description={["在 Markdown 消息中使用 $ 包裹公式以使用内联模式（Inline Mode）显示公式，或使用 $$ 包裹公式以使用外显模式（Display Mode）显示公式。"]} isLast={true} />
                </SettingsBox>
            </SettingsSection>
            <SettingsSection title="插件设置">
                <SettingsBox>
                    <SettingsBoxItem title="为所有消息启用" description={["将所有消息都视为 Markdown 消息（不推荐）。"]} isLast={pluginConfig.renderEverything}>
                        <Switch checked={pluginConfig.renderEverything} onToggle={(state) => setPluginConfig("renderEverything", state)} />
                    </SettingsBoxItem>
                    {!pluginConfig.renderEverything && (
                        <SettingsBoxItem title="Markdown 标记" description={["包含此标记的消息将会被视为 Markdown 消息。", "支持多个标记，请使用英文逗号（,）分割。"]} isLast={true}>
                            <Input value={pluginConfig.markdownFlags} onChange={(state) => setPluginConfig("markdownFlags", state)} />
                        </SettingsBoxItem>
                    )}
                </SettingsBox>
            </SettingsSection>
        </>
    );
}
