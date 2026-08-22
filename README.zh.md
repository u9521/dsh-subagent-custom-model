# dsh-session-settings

[English](README.md) | 中文

**DeepSeek Harness (DSH) Web GUI 会话设置、MCP 服务器与 Skill（技能）管理插件。**

支持在 Web 界面中为各个会话独立或全局统一配置：
1. **子代理模型与思考等级**：包含 `subagent`、`subagent_fork`、`workflow` 等调用的底层模型（Provider / Model）与推理思考等级（Reasoning Effort）。
2. **MCP 服务器集中管理**：在设置左侧栏独立管理 Model Context Protocol (MCP) 服务器，支持 2 阶段兼容性探测、自动协议降级接入、工具列表查看与入参检查。
3. **会话级 MCP 工具细粒度控制**：为特定会话按需启用/禁用 MCP 服务及单独禁用指定工具，或选择跟随全局默认。
4. **会话级 Skill（技能）启停与管控**：支持为各个会话单独启用/禁用内置、用户及项目 Skill，自动过滤提示词 `<available_skills>` 目录与快捷指令，严格阻断已禁用技能的执行。

---

## 界面预览

### 1. 会话独立设置（模型 / MCP 工具 / 技能）
![会话独立设置](docs/pics/session-settings.png)

### 2. MCP 服务器集中管理
![MCP 服务器集中管理](docs/pics/mcp-servers.png)

### 3. 技能管理与独立规则详情
![技能管理与独立规则详情](docs/pics/skills-management.png)

---

## 目录

- [功能特性](#功能特性)
- [界面预览](#界面预览)
- [插件安装](#插件安装)
  - [🚀 一行命令安装（推荐）](#-一行命令安装推荐)
  - [从源码安装教程（开发者）](#从源码安装教程开发者)
- [常用开发与维护命令](#常用开发与维护命令)
- [常见问题 (FAQ)](#常见问题-faq)
- [开源协议](#开源协议)

---

## 功能特性

- **设置侧边栏独立入口**：位于 Web 界面「设置」左侧导航栏一级菜单（专属图标），一键直达 MCP 服务器与技能集中管理。
- **会话独立 Tab 标签页**：位于会话详情页右侧顶部（轨迹旁），方便针对当前会话进行模型、MCP 与技能隔离配置。
- **三层模式按需切换**：
  - **使用全局默认**：当前会话不作覆盖，直接沿用全局统一规则。
  - **跟随当前会话**：子代理无条件继承父会话选用的模型与思考等级。
  - **自定义配置**：为当前会话单独指定子代理模型、可用 MCP 服务及单独禁用指定工具或技能。
- **即时动态生效**：配置保存后对下一次子代理调用、MCP 工具执行及技能调用立即生效，无需重启服务或刷新页面。

---

## 插件安装

### 🚀 一行命令安装（推荐）

本仓库已配置 GitHub Actions 自动构建最小发布分支（`dist` 分支包含完整编译产物与元数据，无多余源码与依赖）。

直接运行以下命令即可一行安装，无需本地编译：

```sh
dsh plugin --profile web add github:u9521/dsh-session-settings#dist
```

> **提示**：安装完成后，启动或重启 Web 服务即可生效：
> ```sh
> dsh web
> ```

---

## 从源码安装教程（开发者）

### 第 1 步：获取源码

将插件代码克隆到本地：

```sh
mkdir -p ~/.dsh/plugins
cd ~/.dsh/plugins

git clone https://github.com/u9521/dsh-session-settings.git
cd dsh-session-settings
```

### 第 2 步：安装依赖与构建

```sh
pnpm install
pnpm run build
```

### 第 3 步：安装到 DSH Web Profile

```sh
dsh plugin --profile web add .
```

#### 验证安装状态
列出 Web Profile 中的已安装插件，确认包含 `@local/dsh-session-settings`：

```sh
dsh plugin --profile web list
```

### 第 4 步：启动并验证

```sh
dsh web
```

---

## 常用开发与维护命令

| 命令 | 描述 |
| :--- | :--- |
| `pnpm run build` | 完整构建（TypeScript 类型检查 + 生成 `lib/` 构建产物） |
| `pnpm run check` | 仅执行类型检查（`tsc --noEmit`），不生成文件 |
| `pnpm run fmt` | 使用 Prettier 自动格式化源码与配置文件 |
| `pnpm run fmt:check` | 检查代码格式规范 |

---

## 常见问题 (FAQ)

### Q1: 修改会话配置或禁用工具/技能后，需要重启 `dsh web` 吗？
**A**: 不需要。插件在宿主端挂载了实时请求拦截器与动态规则注入机制，保存后后端即时更新并生效。

### Q2: 如何卸载或移除本插件？
**A**: 可以通过 DSH CLI 随时从 Web Profile 中移除：
```sh
dsh plugin --profile web remove @local/dsh-session-settings
```

---

## 开源协议

本项目基于 [MIT License](LICENSE) 授权开源。
