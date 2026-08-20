# dsh-subagent-custom-model

English | [中文](README.zh.md)

**Dynamic subagent model and reasoning effort configuration plugin for DeepSeek Harness (DSH) Web GUI.**

Configure language models (Provider / Model) and reasoning effort levels used by subagents (`subagent`, `subagent_fork`, `workflow`, etc.) per-session or globally directly from the Web GUI with immediate effect.

![Plugin Screenshot](docs/pics/screenshot.png)

---

## Table of Contents

- [Features](#features)
- [Usage Guide](#usage-guide)
  - [1. Opening the Configuration Dialog](#1-opening-the-configuration-dialog)
  - [2. Configuration Modes Explained](#2-configuration-modes-explained)
  - [3. Saving & Setting as Global Default](#3-saving--setting-as-global-default)
  - [4. Resetting Session Overrides](#4-resetting-session-overrides)
- [Installation from Source](#installation-from-source)
  - [Prerequisites](#prerequisites)
  - [Step 1: Obtain the Source Code](#step-1-obtain-the-source-code)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Build the Plugin](#step-3-build-the-plugin)
  - [Step 4: Register to DSH Web Profile](#step-4-register-to-dsh-web-profile)
  - [Step 5: Start and Verify](#step-5-start-and-verify)
- [Development & Maintenance Commands](#development--maintenance-commands)
- [Configuration Storage Format](#configuration-storage-format)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [License](#license)

---

## Features

- **Sidebar Quick Access**: Located directly above "Settings" in the sidebar footer; displays real-time status badges (`Default`, `Inherit`, or `<model-name>`) and opens the config modal with one click.
- **Three Flexible Modes**:
  - **Use Global Default**: Apply the global subagent rules without per-session overrides.
  - **Follow Parent Session**: Subagents inherit the exact model and reasoning effort from the current session.
  - **Specify Custom Model**: Independently assign Provider, Model, and Reasoning Effort for subagents in the current session.
- **Instant Effect**: Applies immediately to new subagent requests without restarting DSH or reloading the page.

---

## Usage Guide

### 1. Opening the Configuration Dialog
In the DeepSeek Harness Web GUI, locate the **"Subagent Models"** button at the bottom of the left sidebar (directly above "Settings"). Click it to open the configuration dialog for the active session.

The top of the dialog displays:
- **Scope**: The title of the session currently being configured (or Global Default).
- **Effective Configuration**: The exact model, provider, and reasoning effort currently in effect.
- **Status Badge**: `Default` (inheriting global default), `Inherit` (following parent session), or `Custom` (custom model selected).

### 2. Configuration Modes Explained

| Mode | Recommended Use Case | Description |
| :--- | :--- | :--- |
| **Use Global Default Config** | Standard sessions | Adopts the global default rule; automatically syncs whenever the global default is updated. |
| **Follow Current Parent Session Model** | Main model changes frequently | Subagents unconditionally mirror the parent session's Provider, Model, and reasoning effort. |
| **Specify Custom Subagent Model** | Fine-tuned sub-task routing | Manually specify a **Model Provider**, **Model Name**, and optional **Reasoning Effort**. |

#### Steps for Custom Model Configuration:
1. Select the **"Specify Custom Subagent Model"** radio option.
2. In the **Model Provider** dropdown, select your desired provider (e.g. deepseek, openai, anthropic, google, etc.).
3. In the **Model Name** dropdown, select the specific model.
4. If the selected model supports reasoning effort adjustments, a **Reasoning Effort** dropdown will appear. Choose your preferred effort level (e.g., `high`, `medium`, `low`, etc.).

### 3. Saving & Setting as Global Default

- **Save for Session**:
  - Click **"Save Configuration / Save for Session"**.
  - The configuration applies immediately to the current session and takes effect on any upcoming `subagent` or `workflow` delegations.
- **Set as Global Default**:
  - If you wish to make the current selection the default for all future sessions, click **"Set as Global Default"**.
  - This updates the global default configuration and automatically clears the session's individual override.

### 4. Resetting Session Overrides
If a session has a custom override configured, a **"Clear Override (Use Global Default)"** button will be displayed. Clicking this reverts the session back to following the global default settings.

---

## Installation

### 🚀 One-Line Quick Install (Recommended)

This repository includes a GitHub Actions workflow that automatically builds and deploys a minimal release to the `dist` branch (containing built artifacts and manifests without raw source bloat).

You can install this plugin with a single command without any local build step:

```sh
dsh plugin --profile web add github:u9521/dsh-subagent-custom-model#dist
```

> **Note**: After installation, start or restart the Web service:
> ```sh
> dsh web
> ```

---

## Installation from Source (For Developers)

Follow the step-by-step instructions below to build and install this plugin from source into your DeepSeek Harness environment.

### Prerequisites

Ensure the following tools are installed on your system:
- **Node.js**: `^22.19.0` or `>=24.0.0`
- **pnpm**: `pnpm >= 9.x`
- **DeepSeek Harness**: `dsh` CLI (`>= 0.1.0-rc.6`)

Verify your environment:
```sh
node -v
pnpm -v
dsh --version
```

### Step 1: Obtain the Source Code

Clone or download the plugin repository to your local machine (recommended location: `~/.dsh/plugins/`):

```sh
# Create and navigate to the plugin directory
mkdir -p ~/.dsh/plugins
cd ~/.dsh/plugins

# Clone the repository (or copy the source code)
git clone https://github.com/u9521/dsh-subagent-custom-model.git
cd dsh-subagent-custom-model
```

### Step 2: Install Dependencies

Install required build and runtime dependencies using `pnpm`:

```sh
pnpm install
```

> **Note**: The official DSH client bundling preset is vendored directly under `external/deepseek-harness/packages/client/`. No external DSH checkout is required.

### Step 3: Build the Plugin

Compile the TypeScript source code and bundle the Host plugin and Web Client artifacts:

```sh
pnpm run build
```

Upon a successful build, the `lib/` directory will be generated:
- `lib/index.js`: Host plugin runtime entry (ESM)
- `lib/client.js`: Web client UI bundle (CJS)
- `lib/types/`: TypeScript type declarations

To run a type check without emitting files:
```sh
pnpm run check
```

### Step 4: Register to DSH Web Profile

Use the `dsh plugin` CLI command to add the plugin to the `web` profile:

```sh
# Run from within the plugin directory:
dsh plugin --profile web add .
```

*Alternatively, register using an absolute path:*
```sh
dsh plugin --profile web add ~/.dsh/plugins/dsh-subagent-custom-model
```

#### Verify Installation
List the plugins in the `web` profile to verify that `@local/dsh-subagent-custom-model` is registered:

```sh
dsh plugin --profile web list
```

### Step 5: Start and Verify

Start (or restart) the DSH Web service:

```sh
dsh web
```

Open your browser and navigate to the Web GUI (typically `http://localhost:3080`). You should see the **"Subagent Models"** button and status badge in the sidebar footer.

---

## Development & Maintenance Commands

| Command | Description |
| :--- | :--- |
| `pnpm run build` | Full build (runs `tsc` type check + generates `lib/` bundles) |
| `pnpm run check` | Type check only (`tsc --noEmit`) without emitting files |
| `pnpm run fmt` | Format source code and configuration files with Prettier |
| `pnpm run fmt:check` | Check code formatting compliance |
| `pnpm run sync` | Sync vendored DSH client bundle preset from upstream (`--check` or `--yes`) |

---

## Configuration Storage Format

Configuration is stored in `~/.dsh/storages/subagent_model.json`. Example structure:

```json
{
  "default": {
    "mode": "custom",
    "provider": "deepseek",
    "model": "deepseek-chat"
  },
  "sessions": {
    "session-uuid-1": {
      "mode": "inherit"
    },
    "session-uuid-2": {
      "mode": "custom",
      "provider": "openai",
      "model": "gpt-4o-mini",
      "reasoningEffort": "medium"
    }
  }
}
```

- `default`: The global fallback configuration (`inherit` or `custom`).
- `sessions`: Map of per-session overrides by session ID. Sessions set to `default` or unlisted will follow the global default.

---

## Frequently Asked Questions (FAQ)

### Q1: Why is the Reasoning Effort selector not showing for certain models?
**A**: The Reasoning Effort selector only renders when the chosen model explicitly exposes reasoning capability options in its metadata (`reasoning.efforts`). For standard chat-only models without reasoning configurations, this selector remains hidden.

### Q2: Do I need to restart `dsh web` after updating model settings?
**A**: No. The host plugin intercepts requests dynamically at runtime. As soon as you save the settings in the Web GUI, they take effect on the very next subagent invocation.

### Q3: How do I uninstall or remove the plugin?
**A**: Remove it anytime using the DSH CLI:
```sh
dsh plugin --profile web remove @local/dsh-subagent-custom-model
```

---

## License

This project is licensed under the [MIT License](LICENSE).
