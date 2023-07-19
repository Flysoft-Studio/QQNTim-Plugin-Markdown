# QQNTim Markdown 及 LaTeX 渲染插件

## 简介

本插件让 QQNT 支持 Markdown 及 LaTeX 渲染。需要安装 [QQNTim 3.0 及以上版本](https://github.com/Flysoft-Studio/QQNTim) 才能使用。

效果图：

![截图](.github/screenshot.png)

效果图中使用的 Markdown：

````md
<md>
### 标题

正常、**粗体**、~~删除线~~、_斜体_、`代码 code`

```bash
echo "代码文本" > /dev/null
```

表情符号和 Markdown 混合：**你好[表情]文本**

图片：[图片]

表格：

| 名称     | 说明     |
| -------- | -------- |
| 项 目 一 | 说 明 一 |
| 项 目 二 | 说 明 二 |

$$\sum_{k=1}^n k^2 = \frac{1}{2} n (n+1)$$
````

## 使用

### Markdown 消息

在消息头部插入 `<md>` 或 `<markdown>`（可自定义）即可使用 Markdown 渲染你的消息。

### LaTeX 渲染

**在 Markdown 消息**中使用 `$` 包裹公式以使用内联模式（Inline Mode）显示公式，或使用 `$$` 包裹公式以使用外显模式（Display Mode）显示公式。

## 开发

### 配置环境

请先下载安装 [Node.js 18](https://nodejs.org/)，并在本项目下打开终端，运行：

```bash
# 启用 Corepack 以使用 Yarn 3
corepack enable
# 配置项目依赖
yarn
```

之后，用你的代码编辑器打开此项目（推荐使用 [VSCode](https://code.visualstudio.com/) 进行开发）。

### 编写代码

可参考 QQNTim 内置的[设置界面插件](https://github.com/Flysoft-Studio/QQNTim/tree/dev/src/builtins/settings)进行编写。

### 调试插件

如果你使用的是 Windows，请使用终端运行：

```bash
yarn dev && yarn start:win
```

如果你使用的是 Linux，请使用终端运行：

```bash
yarn dev && yarn start:linux
```

运行后，将会自动启动 QQ，你可以在 QQ 内按下 `F12` 打开开发者工具。

### 构建并发布插件

请使用终端运行：

```bash
yarn build
```

运行后，将会在 `dist` 文件下生成最终的插件。

此模板项目同时也包含了一个 [GitHub Actions Workflow 示例](.github/workflows/build.yml)。你可以使用它来自动化你的插件构建。

## 附录

### 可用命令

| 命令                     | 说明                                            |
| ------------------------ | ----------------------------------------------- |
| `yarn build`             | 构建插件                                        |
| `yarn dev`               | 构建开发版本插件（包含 SourceMap）              |
| `yarn start:win`         | 安装你的插件并启动 QQNT（Windows 下请使用此项） |
| `yarn start:linux`       | 安装你的插件并启动 QQNT（Linux 下请使用此项）   |
| `yarn lint`              | 对代码进行检查                                  |
| `yarn lint:apply`        | 应用推荐的代码修改                              |
| `yarn lint:apply-unsafe` | 应用推荐的代码修改（包括不安全的修复）          |
| `yarn format`            | 格式化代码                                      |
