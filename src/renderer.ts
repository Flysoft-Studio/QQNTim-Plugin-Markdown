import { PluginConfig, getPluginConfig } from "./config";
import { s } from "./utils/sep";
import { randomUUID } from "crypto";
import { decode } from "html-entities";
import katex, { KatexOptions } from "katex";
import MarkdownIt from "markdown-it";
import { env, utils } from "qqntim/renderer";
import sanitizeHtml from "sanitize-html";

export default class Entry implements QQNTim.Entry.Renderer {
    private md = new MarkdownIt({ html: true });
    private config: PluginConfig;
    constructor() {
        this.config = getPluginConfig(env.config.plugins.config);
    }
    private renderMarkdown(text: string) {
        text = text.trim();

        // 搜索 TeX 标签
        const expressions = new Map<string, [string, KatexOptions]>();
        for (const tag of ["$$", "$"]) {
            let texStart = 0;
            do {
                texStart = text.indexOf(tag, texStart);
                const texEnd = text.indexOf(tag, texStart + tag.length);
                if (texEnd == -1) break;
                const expression = decode(text.substring(texStart + tag.length, texEnd), { level: "html5" });
                const id = randomUUID();
                expressions.set(id, [expression, { throwOnError: false, displayMode: tag == "$$" }]);

                text = `${text.slice(0, texStart)}TEX-${id}${text.slice(texEnd + tag.length)}`;
                texStart = texEnd + tag.length;
            } while (texStart != -1);
        }

        const rawHtml = this.md.render(text);

        // 过滤不安全的 HTML 标签
        let safeHtml = sanitizeHtml(rawHtml, {
            allowedSchemes: ["appimg"],
            allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: [...sanitizeHtml.defaults.allowedAttributes.img, "draggable"],
            },
            allowedClasses: {
                img: ["markdown-face"],
            },
            allowVulnerableTags: false,
        });

        // 渲染并应用 TeX 标签
        for (const [id, [expression, options]] of expressions) {
            safeHtml = safeHtml.replace(`TEX-${id}`, katex.renderToString(expression, options));
        }
        return safeHtml;
    }
    onWindowLoaded(): void {
        // 添加 KaTeX 相关样式
        const style = document.createElement("link");
        style.href = encodeURI(`file://${__dirname.replaceAll(s, "/")}/katex.min.css`);
        style.type = "text/css";
        style.rel = "stylesheet";
        document.head.appendChild(style);

        // 获取表情资源路径
        utils
            .ntCall("ns-ntApi", "nodeIKernelMsgService/getEmojiResourcePath", [{ type: 1 }])
            .then((args: any) => args.resourcePath.replaceAll(s, "/") as string)
            .then((emojiResDir) => {
                new MutationObserver(() => {
                    const elements = document.querySelectorAll<HTMLElement>(".message-content:not(.markdown-patched)");
                    for (const element of elements) {
                        element.classList.add("markdown-patched");
                        const msg = element.__VUE__?.[0]?.props?.msgRecord;
                        if (msg) {
                            const msgElements = msg?.elements;

                            // 判断消息是否需要渲染
                            const flags = this.config.markdownFlags.split(",");
                            let isMarkdown = this.config.renderEverything;
                            if (!isMarkdown) for (const msgElement of msgElements) if (msgElement) for (const flag of flags) if (msgElement?.textElement?.content?.includes(flag)) isMarkdown = true;
                            if (!isMarkdown) continue;
                            element.classList.add("markdown-enabled");

                            // 将消息中携带的图片和表情全部转换为 HTML 标签
                            let text = "";
                            for (const msgElement of msgElements)
                                if (msgElement)
                                    if (msgElement?.textElement) {
                                        let content = msgElement.textElement.content as string;
                                        for (const flag of flags) content = content.replaceAll(flag, "");
                                        text += content;
                                    } else if (msgElement?.picElement) text += `<img src="${encodeURI(`appimg://${msgElement.picElement.sourcePath}`)}" alt="图片" draggable="true">`;
                                    else if (msgElement?.faceElement) text += `<img class="markdown-face" src="appimg://${emojiResDir}/gif/s${msgElement.faceElement.faceIndex}.gif" alt="${msgElement.faceElement.faceText || "表情"}" width="24px" draggable="false">`;

                            element.innerHTML = this.renderMarkdown(text);
                        }
                    }
                }).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
            });
    }
}
