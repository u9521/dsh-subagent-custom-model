window.__ModuleLoader__.load({
	id: "@local/dsh-session-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/i18n.ts
		const zh = {
			compatibility: {
				incompatibleBadge: "2026-07-28 官方暂不支持",
				incompatibleDesc: "该服务仅支持 2026-07-28 无状态协议（不支持向下降级），官方 @deepseek-ai/dsh-mcp-client 暂未支持，禁止启用。",
				downgradedBadge: "已降级至 {version}",
				downgradedDesc: "服务端支持降级，已自动协商为兼容模式接入官方客户端。"
			},
			sessionSettings: {
				compatibility: {
					incompatibleBadge: "2026-07-28 官方暂不支持",
					incompatibleDesc: "该服务仅支持 2026-07-28 无状态协议（不支持向下降级），官方 @deepseek-ai/dsh-mcp-client 暂未支持，禁止启用。",
					downgradedBadge: "已降级至 {version}",
					downgradedDesc: "服务端支持降级，已自动协商为兼容模式接入官方客户端。"
				},
				title: "会话设置",
				desc: "当前会话定制子代理执行模型与可用的 MCP 工具服务器。",
				sessionIdLabel: "会话 ID",
				copyIdBtn: "复制 ID",
				idCopied: "已复制",
				nav: {
					modelTitle: "子代理模型",
					mcpTitle: "MCP 服务器",
					skillsTitle: "技能"
				},
				tab: {
					model: "子代理模型",
					mcp: "MCP 服务器",
					skills: "技能"
				},
				section: {
					modelTitle: "子代理模型",
					modelDesc: "此会话执行子代理（Subagent、Subagent Fork、Workflow 等）时所使用的模型与思考等级。",
					mcpTitle: "MCP 服务器",
					mcpDesc: "管理当前会话可调用的 Model Context Protocol (MCP) 服务器。",
					skillsTitle: "技能 (Skills)",
					skillsDesc: "管理当前会话可调用的技能（Skills），包括内置、用户定义和项目专属技能。"
				},
				scope: {
					currentSession: "当前会话",
					globalDefault: "全局默认配置",
					sessionCustom: "已为此会话单独配置",
					sessionDefault: "跟随全局默认设置"
				},
				status: {
					title: "生效配置",
					default: "默认",
					inherit: "继承",
					custom: "自定义",
					activeCount: "已启用 {count} 个",
					none: "未启用"
				},
				clone: {
					toolbarTitle: "克隆预设：",
					inputPlaceholder: "粘贴源会话 ID (如 session-xxxx)",
					applyBtn: "克隆配置",
					loading: "载入中...",
					success: "已成功克隆会话「{name}」的预设！请确认后点击下方「保存」生效。",
					error: "克隆失败：未找到该会话 ID 或无法读取其配置"
				},
				mode: {
					default: {
						title: "使用全局默认配置",
						desc: "此会话不进行独立配置，直接继承全局默认规则。"
					},
					inherit: {
						title: "跟随当前父会话模型",
						desc: "子代理继承当前会话所选用的模型与思考等级。"
					},
					custom: {
						title: "指定此会话的子代理模型",
						desc: "为此会话单独指定专属的模型。"
					}
				},
				mcpMode: {
					default: {
						title: "使用全局默认规则",
						desc: "使用全局设置中标记为“默认开启”的所有 MCP 服务器。"
					},
					custom: {
						title: "为此会话自定义",
						desc: "仅在当前会话中启用以下 MCP 服务器。"
					}
				},
				skillsMode: {
					default: {
						title: "使用全局默认规则",
						desc: "使用全局设置中定义的技能启用/禁用配置。"
					},
					custom: {
						title: "为此会话自定义",
						desc: "为当前会话单独配置启用的技能列表。"
					}
				},
				skills: {
					title: "技能管理",
					desc: "配置所有新会话默认生效的 Skill 启用/禁用规则。支持分别独立管控模型的 tool-skill 工具调用与用户的 /快捷指令。",
					empty: "当前工作区未发现任何可用技能。可在项目根目录或 ~/.dsh/skills 中添加。",
					noMatch: "未找到匹配的技能。",
					searchPlaceholder: "搜索技能名称或描述...",
					enableAll: "全部启用",
					disableAll: "全部禁用",
					resetToDefault: "重置为全局默认",
					refresh: "刷新技能",
					refreshing: "正在刷新技能列表...",
					expand: "展开",
					collapse: "折叠",
					modelInvocableTitle: "模型调用",
					modelInvocableDesc: "允许模型通过 skill 工具按需加载该技能并在提示词目录中展示",
					userInvocableTitle: "用户快捷调用",
					userInvocableDesc: "允许用户在对话输入框中通过 /技能名 快捷注入完整技能指令",
					instructionsAccordionExpand: "展开 指令与规则",
					instructionsAccordionCollapse: "折叠 指令与规则",
					runtimeBadge: "运行时预设",
					runtimeNotice: "此技能由当前会话的预设或运行时提供，仅在当前会话生效，不可设为全局默认。",
					noInstructions: "（暂无详细指令内容）",
					viewDetails: "配置 / 详情",
					hideDetails: "关闭",
					openModalBtn: "配置 / 详情",
					modalTitle: "技能详情与管控配置",
					modalDesc: "查看技能定义信息，并配置其模型自动调用与用户快捷调用的权限规则。",
					rulesSectionTitle: "调用权限管控",
					instructionsSectionTitle: "指令与规则",
					modalDoneBtn: "完成",
					sourceLabel: "来源",
					sourceProject: "项目技能",
					sourceUser: "用户技能",
					sourceBundled: "内置技能",
					sourceRuntime: "运行时预设",
					modelInvocable: "模型调用: 开启",
					userInvocable: "快捷指令: 开启",
					modelInvocableEnabled: "模型调用: 开启",
					modelInvocableDisabled: "模型调用: 禁用",
					userInvocableEnabled: "快捷指令: 开启",
					userInvocableDisabled: "快捷指令: 禁用",
					pathLabel: "文件路径：",
					whenToUseLabel: "使用时机：",
					instructionsTitle: "指令与规则",
					loadingContent: "正在加载技能内容...",
					loadFailed: "加载技能内容失败",
					statusActive: "已启用",
					statusDisabled: "已禁用",
					activeCountBadge: "已启用 {enabled} / {total}",
					allEnabledBadge: "全部启用",
					allDisabledBadge: "全部禁用",
					defaultBadge: "全局默认开启",
					effectiveInfoDefault: "当前跟随全局默认配置（共 {total} 个技能，已启用 {enabled} 个）",
					effectiveInfoCustom: "当前会话独立自定义（共 {total} 个技能，已启用 {enabled} 个）"
				},
				mcp: {
					empty: "暂无已配置的 MCP 服务器。可在「设置 -> 插件配置 -> MCP 服务器」中集中添加。",
					selectAll: "全选",
					deselectAll: "全不选",
					serverType: "协议",
					defaultBadge: "全局默认开启",
					toolsBtn: "配置工具",
					toolsModeDefaultBadge: "工具: 跟随默认",
					toolsModeCustomBadge: "工具: 单独配置 ({count} 禁用)",
					toolsAllActiveBadge: "工具: 全部启用"
				},
				toolsModal: {
					title: "会话工具配置",
					desc: "为当前会话配置该 MCP 服务的可用工具，或选择跟随全局默认设置。",
					modeDefaultTitle: "跟随全局默认配置",
					modeDefaultDesc: "使用全局 MCP 服务设置中定义的工具禁用列表（当前全局已禁用 {count} 个工具）。",
					modeCustomTitle: "为此会话单独配置工具",
					modeCustomDesc: "单独指定在当前会话中启用或禁用的工具。",
					searchPlaceholder: "搜索工具名称或描述...",
					enableAll: "全部启用",
					disableAll: "全部禁用",
					resetToDefault: "重置为全局默认",
					noToolsAvailable: "该服务器暂未发现工具，或尚未成功连接获取。",
					toolEnabled: "已启用",
					toolDisabled: "已禁用",
					toolGlobalDisabledBadge: "全局默认禁用",
					toolCustomDisabledBadge: "当前会话禁用",
					save: "应用工具设置",
					saving: "保存中...",
					cancel: "取消",
					disabledCount: "当前会话共禁用 {count} 个工具",
					allEnabledCount: "全部工具可用 (共 {total} 个)",
					parameters: "展开",
					hideParameters: "收起",
					paramsCount: "{total} 个参数 ({required} 必填)",
					noParams: "无入参",
					viewList: "列表",
					viewRaw: "Raw JSON",
					required: "必填",
					optional: "可选",
					defaultVal: "默认值: ",
					enumVal: "枚举: ",
					noDesc: "暂无工具描述",
					fetchToolsBtn: "获取工具列表",
					fetchingTools: "正在连接获取工具..."
				},
				field: {
					provider: "模型提供方 (Provider)",
					providerPlaceholder: "请选择提供方...",
					model: "模型名称 (Model)",
					modelPlaceholder: "请选择模型...",
					reasoningEffort: "思考等级 (Reasoning Effort)",
					reasoningEffortDefault: "模型默认 (Default)",
					reasoningOff: "关闭思考 (off)",
					reasoningMinimal: "极低思考 (minimal)",
					reasoningLow: "低思考 (low)",
					reasoningMedium: "中等思考 (medium)",
					reasoningHigh: "高思考 (high)",
					reasoningXhigh: "超高思考 (xhigh)",
					reasoningMax: "最大思考 (max)"
				},
				action: {
					save: "保存配置",
					saveSession: "保存此会话配置",
					saveDefault: "设为全局默认",
					saving: "保存中...",
					savingDefault: "设为默认中...",
					reset: "清除独立设置 (恢复全局默认)",
					copyId: "复制会话 ID"
				},
				notice: {
					saved: "会话设置已保存并即时生效！",
					savedDefault: "已成功更新全局默认设置！",
					idCopied: "会话 ID 已复制到剪贴板！",
					error: "保存失败："
				},
				loading: "正在加载模型与配置..."
			},
			mcpServers: {
				tabLabel: "MCP 服务器",
				title: "MCP 服务器管理",
				desc: "集中配置并管理 Model Context Protocol (MCP) 服务器，供各个会话按需选用与隔离。",
				actions: {
					add: "添加 MCP 服务器",
					import: "导入配置 (JSON)",
					export: "导出配置",
					test: "测试连接",
					testing: "测试中...",
					toolsList: "工具列表",
					toolsFetching: "获取中...",
					edit: "编辑",
					delete: "删除",
					save: "保存服务器",
					saveSettings: "保存设置",
					saving: "保存中...",
					cancel: "取消",
					refresh: "刷新列表"
				},
				table: {
					id: "标识 (ID)",
					name: "名称",
					transport: "传输协议",
					target: "目标命令 / 地址",
					enabledDefault: "默认开启",
					actions: "操作",
					empty: "暂未添加任何 MCP 服务器。点击上方「添加 MCP 服务器」或「导入配置」开始。"
				},
				form: {
					addTitle: "添加 MCP 服务器",
					editTitle: "编辑 MCP 服务器",
					id: "服务器标识 (ID)",
					idPlaceholder: "如 github_mcp, local_fs, sqlite",
					idHint: "仅限英文字母、数字、下划线和短横线",
					name: "显示名称",
					namePlaceholder: "如 GitHub 官方工具",
					description: "描述 (可选)",
					descriptionPlaceholder: "简要说明此 MCP 提供的工具与功能",
					transport: "传输协议",
					transportStdio: "stdio (本地命令行子进程)",
					transportHttp: "HTTP / SSE (远程或本地服务地址)",
					command: "启动命令 (Command)",
					commandPlaceholder: "如 npx, python, uvx, node",
					args: "命令行参数 (Arguments)",
					argsPlaceholder: "每行一个参数，或空格隔开。例如：\n-y\n@modelcontextprotocol/server-github",
					cwd: "工作目录 (CWD，可选)",
					cwdPlaceholder: "子进程的工作目录，留空使用当前项目目录",
					env: "环境变量 (ENV，可选)",
					envKey: "变量名",
					envValue: "变量值",
					addEnv: "添加环境变量",
					url: "服务端地址 (URL)",
					urlPlaceholder: "如 http://localhost:3000/mcp",
					headers: "自定义请求头 (Headers，可选)",
					headerKey: "请求头名",
					headerValue: "请求头值",
					addHeader: "添加请求头",
					enabledByDefault: "默认开启",
					enabledByDefaultDesc: "启用后，会话在默认模式下将自动加载此 MCP 服务器",
					advancedTitle: "高级与运行时配置",
					toolCallTimeoutMs: "调用超时 (毫秒)",
					toolCallTimeoutMsPlaceholder: "默认 60000 毫秒 (60秒)",
					toolCallTimeoutMsDesc: "每次工具调用的最长超时等待时间",
					failOnStartupError: "启动失败时拒绝激活",
					failOnStartupErrorDesc: "初始连接或工具同步失败时直接拒绝插件激活 (默认关闭)",
					reconnectGroup: "自动重连策略",
					reconnectEnabled: "启用自动重连",
					reconnectEnabledDesc: "连接丢失后以指数退避策略自动重连 (默认开启)",
					reconnectInitialDelayMs: "首次重连延迟 (毫秒)",
					reconnectInitialDelayMsPlaceholder: "默认 500 毫秒",
					reconnectMaxDelayMs: "重连退避上限 (毫秒)",
					reconnectMaxDelayMsPlaceholder: "默认 30000 毫秒 (30秒)",
					reconnectMaxAttempts: "连续重试上限 (次)",
					reconnectMaxAttemptsPlaceholder: "默认 10 次"
				},
				importModal: {
					title: "导入 MCP 配置文件",
					desc: "支持标准 Claude Desktop / Cursor 格式的 JSON 配置文件（包含 mcpServers 键）。",
					placeholder: "{\n  \"mcpServers\": {\n    \"github\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"],\n      \"env\": {\n        \"GITHUB_PERSONAL_ACCESS_TOKEN\": \"ghp_...\"\n      }\n    }\n  }\n}",
					confirm: "确认导入",
					importing: "正在导入...",
					success: "成功导入 {count} 个 MCP 服务器！",
					error: "导入失败：JSON 格式不正确或未找到合法的 mcpServers 条目"
				},
				toolsModal: {
					title: "MCP 工具管理",
					serverPrefix: "所属服务器：",
					searchPlaceholder: "搜索工具名称或描述...",
					enableAll: "全部开启",
					disableAll: "全部禁用",
					summary: "共 {total} 个工具：已启用 {enabled} 个，已禁用 {disabled} 个",
					filteredSummary: "匹配到 {count} 个工具",
					parameters: "展开",
					hideParameters: "收起",
					viewList: "参数列表",
					viewRaw: "原始 Schema",
					required: "必填",
					optional: "可选",
					type: "类型",
					defaultVal: "默认: ",
					enumVal: "可选值: ",
					noParams: "该工具无输入参数",
					paramsCount: "共 {total} 个参数 ({required} 必填)",
					noParameters: "该工具无参数定义",
					empty: "未找到匹配的工具",
					serverNoTools: "该 MCP 服务器当前未声明任何可用工具",
					fetching: "正在连接 MCP 服务器并拉取工具列表...",
					fetchFailed: "获取工具列表失败：",
					retry: "重新拉取",
					statusEnabled: "已启用",
					statusDisabled: "已禁用",
					disabledBadge: "已禁用 {count} 个工具",
					saveSuccess: "工具配置已保存！",
					save: "保存工具配置",
					saving: "保存中..."
				},
				saveConfirmModal: {
					title: "连接测试未通过",
					message: "系统在保存前对该服务器进行了连接测试，但未能成功连接：",
					prompt: "是否仍然保存此 MCP 服务器配置？",
					saveAnyway: "仍然保存",
					cancel: "返回修改"
				},
				compatibility: {
					incompatibleBadge: "2026-07-28 官方暂不支持",
					incompatibleDesc: "该服务仅支持 2026-07-28 无状态协议（不支持向下降级），官方 @deepseek-ai/dsh-mcp-client 暂未支持，禁止启用。",
					downgradedBadge: "已降级至 {version}",
					downgradedDesc: "服务端支持降级，已自动协商为兼容模式接入官方客户端。"
				},
				notices: {
					testSuccess: "连接测试成功：",
					testFail: "连接测试失败：",
					deleteConfirm: "确定要删除 MCP 服务器「{name}」吗？",
					saved: "MCP 服务器保存成功！",
					deleted: "MCP 服务器已删除！",
					error: "操作失败："
				}
			},
			skillsSettings: {
				tabLabel: "技能",
				title: "技能管理",
				desc: "集中管理与配置全局 Skill（技能）的默认启用状态与说明规则，供各个会话默认继承与按需调整。",
				actions: {
					enableAll: "全部启用",
					disableAll: "全部禁用",
					save: "保存默认配置",
					saveSettings: "保存默认配置",
					saving: "保存中...",
					refresh: "刷新技能列表",
					refreshing: "刷新中...",
					viewDetails: "展开",
					hideDetails: "折叠"
				},
				summary: "共发现 {total} 个可用技能：全局默认启用 {enabled} 个，全局默认禁用 {disabled} 个",
				searchPlaceholder: "搜索技能名称或描述...",
				empty: "当前工作区未发现任何可用技能。可在项目根目录或 ~/.dsh/skills 中添加。",
				noMatch: "未找到匹配的技能。",
				notices: {
					saved: "全局技能默认配置已保存！",
					saveError: "保存失败：",
					refreshSuccess: "已刷新技能列表！"
				}
			}
		};
		const en = {
			compatibility: {
				incompatibleBadge: "2026-07-28 Unsupported by Official Client",
				incompatibleDesc: "This server only supports 2026-07-28 stateless protocol (no downgrade supported). Official @deepseek-ai/dsh-mcp-client does not support it yet. Enabling is prohibited.",
				downgradedBadge: "Downgraded to {version}",
				downgradedDesc: "Server supports protocol downgrade, auto-negotiated compatibility mode."
			},
			sessionSettings: {
				compatibility: {
					incompatibleBadge: "2026-07-28 Unsupported by Official Client",
					incompatibleDesc: "This server only supports 2026-07-28 stateless protocol (no downgrade supported). Official @deepseek-ai/dsh-mcp-client does not support it yet. Enabling is prohibited.",
					downgradedBadge: "Downgraded to {version}",
					downgradedDesc: "Server supports protocol downgrade, auto-negotiated compatibility mode."
				},
				title: "Session Settings",
				desc: "Customize the subagent model and available MCP tool servers for this session.",
				sessionIdLabel: "Session ID",
				copyIdBtn: "Copy ID",
				idCopied: "Copied",
				nav: {
					modelTitle: "Subagent Model",
					mcpTitle: "MCP Servers",
					skillsTitle: "Skills"
				},
				tab: {
					model: "Subagent Model",
					mcp: "MCP Servers",
					skills: "Skills"
				},
				section: {
					modelTitle: "Subagent Model",
					modelDesc: "The model and reasoning effort used when running subagents (Subagent, Subagent Fork, Workflow, etc.) for this session.",
					mcpTitle: "MCP Servers",
					mcpDesc: "Manage Model Context Protocol (MCP) servers accessible in the current session.",
					skillsTitle: "Skills",
					skillsDesc: "Manage Skills accessible in the current session, including bundled, user, and project skills."
				},
				scope: {
					currentSession: "Current Session",
					globalDefault: "Global Default Config",
					sessionCustom: "Custom configured for this session",
					sessionDefault: "Using global default"
				},
				status: {
					title: "Effective Config",
					default: "Default",
					inherit: "Inherit",
					custom: "Custom",
					activeCount: "{count} enabled",
					none: "Not Enabled"
				},
				clone: {
					toolbarTitle: "Clone Preset:",
					inputPlaceholder: "Paste source session ID (e.g. session-xxxx)",
					applyBtn: "Clone Config",
					loading: "Loading...",
					success: "Successfully cloned preset from session \"{name}\"! Review and click Save below to apply.",
					error: "Clone failed: Session ID not found or unable to read configuration"
				},
				mode: {
					default: {
						title: "Use Global Default Config",
						desc: "No custom configuration for this session; directly inherits global default rules."
					},
					inherit: {
						title: "Follow Current Parent Session Model",
						desc: "Subagents inherit the model and reasoning effort chosen for the current session."
					},
					custom: {
						title: "Specify Subagent Model for This Session",
						desc: "Assign a dedicated model specifically for this session."
					}
				},
				mcpMode: {
					default: {
						title: "Use Global Default Rules",
						desc: "Use all MCP servers marked as \"Default Active\" in global settings."
					},
					custom: {
						title: "Customize for This Session",
						desc: "Enable only the following MCP servers in the current session."
					}
				},
				skillsMode: {
					default: {
						title: "Follow Global Default Rules",
						desc: "Use the skill enablement configuration defined in global default settings."
					},
					custom: {
						title: "Customize for This Session",
						desc: "Specify enabled/disabled skills specifically for this session."
					}
				},
				skills: {
					title: "Skills Management",
					desc: "Configure default Skill enable/disable rules for all new sessions. Supports independent control for model tool-skill invocation and user /slash commands.",
					empty: "No skills discovered in the current workspace. Add them under project root or ~/.dsh/skills.",
					noMatch: "No skills match the search filter.",
					searchPlaceholder: "Search skills by name or description...",
					enableAll: "Enable All",
					disableAll: "Disable All",
					resetToDefault: "Reset to Default",
					refresh: "Refresh Skills",
					refreshing: "Refreshing skill list...",
					expand: "Expand",
					collapse: "Collapse",
					modelInvocableTitle: "Model Invocation",
					modelInvocableDesc: "Allow model to load this skill via skill tool and list in prompt catalog",
					userInvocableTitle: "User Slash Invocation",
					userInvocableDesc: "Allow user to directly invoke this skill via /name gesture in chat",
					instructionsAccordionExpand: "Expand Instructions",
					instructionsAccordionCollapse: "Collapse Instructions",
					runtimeBadge: "Runtime Preset",
					runtimeNotice: "This skill is provided by the active preset or runtime. It only applies to the current session and cannot be set as global default.",
					noInstructions: "(No instructions content)",
					viewDetails: "Configure / Details",
					hideDetails: "Close",
					openModalBtn: "Configure / Details",
					modalTitle: "Skill Details & Invocation Rules",
					modalDesc: "Inspect skill definition and configure model & user invocation permissions.",
					rulesSectionTitle: "Invocation Permissions",
					instructionsSectionTitle: "Instructions & Rules",
					modalDoneBtn: "Done",
					sourceLabel: "Source",
					sourceProject: "Project",
					sourceUser: "User",
					sourceBundled: "Bundled",
					sourceRuntime: "Runtime Preset",
					modelInvocable: "Model: Enabled",
					userInvocable: "Slash Command: Enabled",
					modelInvocableEnabled: "Model: Enabled",
					modelInvocableDisabled: "Model: Disabled",
					userInvocableEnabled: "Slash Command: Enabled",
					userInvocableDisabled: "Slash Command: Disabled",
					pathLabel: "File Path: ",
					whenToUseLabel: "When to Use: ",
					instructionsTitle: "Instructions & Rules",
					loadingContent: "Loading skill instructions...",
					loadFailed: "Failed to load skill content",
					statusActive: "Enabled",
					statusDisabled: "Disabled",
					activeCountBadge: "{enabled} / {total} Enabled",
					allEnabledBadge: "All Enabled",
					allDisabledBadge: "All Disabled",
					defaultBadge: "Default Active",
					effectiveInfoDefault: "Using global default settings ({enabled} of {total} skills enabled)",
					effectiveInfoCustom: "Custom configured for this session ({enabled} of {total} skills enabled)"
				},
				mcp: {
					empty: "No MCP servers configured yet. You can add them in \"Settings -> Plugin Config -> MCP Servers\".",
					selectAll: "Select All",
					deselectAll: "Deselect All",
					serverType: "Protocol",
					defaultBadge: "Default Active",
					toolsBtn: "Configure Tools",
					toolsModeDefaultBadge: "Tools: Default",
					toolsModeCustomBadge: "Tools: Custom ({count} disabled)",
					toolsAllActiveBadge: "Tools: All Active"
				},
				toolsModal: {
					title: "Session Tools Configuration",
					desc: "Configure available tools for this MCP server in the current session, or follow global defaults.",
					modeDefaultTitle: "Follow Global Default Config",
					modeDefaultDesc: "Use the disabled tools list configured in global MCP settings (currently {count} disabled globally).",
					modeCustomTitle: "Customize Tools for This Session",
					modeCustomDesc: "Independently specify which tools to enable or disable in this session.",
					searchPlaceholder: "Search tool name or description...",
					enableAll: "Enable All",
					disableAll: "Disable All",
					resetToDefault: "Reset to Global Default",
					noToolsAvailable: "No tools discovered for this server yet, or not connected.",
					toolEnabled: "Enabled",
					toolDisabled: "Disabled",
					toolGlobalDisabledBadge: "Globally Disabled",
					toolCustomDisabledBadge: "Session Disabled",
					save: "Apply Tools Settings",
					saving: "Saving...",
					cancel: "Cancel",
					disabledCount: "{count} tools disabled for this session",
					allEnabledCount: "All tools enabled ({total} total)",
					parameters: "Parameters",
					hideParameters: "Collapse",
					paramsCount: "{total} params ({required} required)",
					noParams: "No params",
					viewList: "List",
					viewRaw: "Raw JSON",
					required: "Required",
					optional: "Optional",
					defaultVal: "Default: ",
					enumVal: "Enum: ",
					noDesc: "No description provided",
					fetchToolsBtn: "Fetch Tools",
					fetchingTools: "Connecting to fetch tools..."
				},
				field: {
					provider: "Model Provider",
					providerPlaceholder: "Select provider...",
					model: "Model Name",
					modelPlaceholder: "Select model...",
					reasoningEffort: "Reasoning Effort",
					reasoningEffortDefault: "Model Default (Default)",
					reasoningOff: "Disabled (off)",
					reasoningMinimal: "Minimal (minimal)",
					reasoningLow: "Low (low)",
					reasoningMedium: "Medium (medium)",
					reasoningHigh: "High (high)",
					reasoningXhigh: "Extra High (xhigh)",
					reasoningMax: "Maximum (max)"
				},
				action: {
					save: "Save Config",
					saveSession: "Save for Session",
					saveDefault: "Set as Global Default",
					saving: "Saving...",
					savingDefault: "Setting default...",
					reset: "Clear Override (Restore Global Default)",
					copyId: "Copy Session ID"
				},
				notice: {
					saved: "Session settings saved and effective immediately!",
					savedDefault: "Successfully updated global default settings!",
					idCopied: "Session ID copied to clipboard!",
					error: "Failed to save: "
				},
				loading: "Loading models and configuration..."
			},
			mcpServers: {
				tabLabel: "MCP Servers",
				title: "MCP Server Management",
				desc: "Centrally configure and manage Model Context Protocol (MCP) servers for on-demand use and session isolation.",
				actions: {
					add: "Add MCP Server",
					import: "Import (JSON)",
					export: "Export Config",
					test: "Test Connection",
					testing: "Testing...",
					toolsList: "Tools List",
					toolsFetching: "Fetching...",
					edit: "Edit",
					delete: "Delete",
					save: "Save Server",
					saveSettings: "Save Settings",
					saving: "Saving...",
					cancel: "Cancel",
					refresh: "Refresh List"
				},
				table: {
					id: "Identifier (ID)",
					name: "Name",
					transport: "Transport Protocol",
					target: "Target Command / URL",
					enabledDefault: "Default Active",
					actions: "Actions",
					empty: "No MCP servers added yet. Click \"Add MCP Server\" or \"Import (JSON)\" above to get started."
				},
				form: {
					addTitle: "Add MCP Server",
					editTitle: "Edit MCP Server",
					id: "Server ID",
					idPlaceholder: "e.g. github_mcp, local_fs, sqlite",
					idHint: "Only letters, numbers, underscores, and hyphens",
					name: "Display Name",
					namePlaceholder: "e.g. GitHub Official Tools",
					description: "Description (Optional)",
					descriptionPlaceholder: "Briefly describe the tools and functions provided by this server",
					transport: "Transport Protocol",
					transportStdio: "stdio (Local CLI Subprocess)",
					transportHttp: "HTTP / SSE (Remote or Local Endpoint)",
					command: "Command",
					commandPlaceholder: "e.g. npx, python, uvx, node",
					args: "Arguments",
					argsPlaceholder: "One argument per line or space-separated. For example:\n-y\n@modelcontextprotocol/server-github",
					cwd: "Working Directory (Optional)",
					cwdPlaceholder: "Working directory for child process, leave empty for current project directory",
					env: "Environment Variables (Optional)",
					envKey: "Variable Name",
					envValue: "Value",
					addEnv: "Add Environment Variable",
					url: "Server Endpoint URL",
					urlPlaceholder: "e.g. http://localhost:3000/mcp",
					headers: "Custom Headers (Optional)",
					headerKey: "Header Name",
					headerValue: "Header Value",
					addHeader: "Add Header",
					enabledByDefault: "Default Active",
					enabledByDefaultDesc: "When enabled, sessions in default mode will automatically load this MCP server.",
					advancedTitle: "Advanced & Runtime Settings",
					toolCallTimeoutMs: "Call Timeout (ms)",
					toolCallTimeoutMsPlaceholder: "Default: 60000 ms (60s)",
					toolCallTimeoutMsDesc: "Maximum timeout for each callTool execution in milliseconds",
					failOnStartupError: "Fail on Startup Error",
					failOnStartupErrorDesc: "Reject plugin activation if initial connection or discovery fails (default: false)",
					reconnectGroup: "Auto Reconnect Policy",
					reconnectEnabled: "Enable Auto Reconnect",
					reconnectEnabledDesc: "Automatically reconnect with exponential backoff on disconnect (default: true)",
					reconnectInitialDelayMs: "Initial Delay (ms)",
					reconnectInitialDelayMsPlaceholder: "Default: 500 ms",
					reconnectMaxDelayMs: "Max Backoff Delay (ms)",
					reconnectMaxDelayMsPlaceholder: "Default: 30000 ms (30s)",
					reconnectMaxAttempts: "Max Retry Attempts",
					reconnectMaxAttemptsPlaceholder: "Default: 10"
				},
				importModal: {
					title: "Import MCP Config",
					desc: "Supports standard Claude Desktop / Cursor formatted JSON configuration (containing \"mcpServers\" key).",
					placeholder: "{\n  \"mcpServers\": {\n    \"github\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"],\n      \"env\": {\n        \"GITHUB_PERSONAL_ACCESS_TOKEN\": \"ghp_...\"\n      }\n    }\n  }\n}",
					confirm: "Confirm Import",
					importing: "Importing...",
					success: "Successfully imported {count} MCP servers!",
					error: "Import failed: Invalid JSON format or missing valid mcpServers entries"
				},
				toolsModal: {
					title: "MCP Tool Management",
					serverPrefix: "Server: ",
					searchPlaceholder: "Search tool name or description...",
					enableAll: "Enable All",
					disableAll: "Disable All",
					summary: "{total} tools total: {enabled} enabled, {disabled} disabled",
					filteredSummary: "{count} tools matching search",
					parameters: "Expand",
					hideParameters: "Collapse",
					viewList: "Parameters",
					viewRaw: "Raw Schema",
					required: "Required",
					optional: "Optional",
					type: "Type",
					defaultVal: "Default: ",
					enumVal: "Enum: ",
					noParams: "No input parameters required",
					paramsCount: "{total} parameters ({required} required)",
					noParameters: "No parameter definition",
					empty: "No matching tools found",
					serverNoTools: "No tools declared by this MCP server",
					fetching: "Connecting to MCP server and fetching tools...",
					fetchFailed: "Failed to fetch tools: ",
					retry: "Retry",
					statusEnabled: "Enabled",
					statusDisabled: "Disabled",
					disabledBadge: "{count} disabled",
					saveSuccess: "Tool configuration saved!",
					save: "Save Tool Settings",
					saving: "Saving..."
				},
				saveConfirmModal: {
					title: "Connection Test Failed",
					message: "The connection test failed before saving:",
					prompt: "Do you still want to save this MCP server configuration?",
					saveAnyway: "Save Anyway",
					cancel: "Back to Edit"
				},
				compatibility: {
					incompatibleBadge: "2026-07-28 Unsupported by Official Client",
					incompatibleDesc: "This server only supports 2026-07-28 stateless protocol (no downgrade supported). Official @deepseek-ai/dsh-mcp-client does not support it yet. Enabling is prohibited.",
					downgradedBadge: "Downgraded to {version}",
					downgradedDesc: "Server supports protocol downgrade, auto-negotiated compatibility mode."
				},
				notices: {
					testSuccess: "Connection test succeeded: ",
					testFail: "Connection test failed: ",
					deleteConfirm: "Are you sure you want to delete MCP server \"{name}\"?",
					saved: "MCP server saved successfully!",
					deleted: "MCP server deleted!",
					error: "Operation failed: "
				}
			},
			skillsSettings: {
				tabLabel: "Skills",
				title: "Skills Management",
				desc: "Centrally manage and configure the global default enabled/disabled status of Skills and inspect instruction rules.",
				actions: {
					enableAll: "Enable All",
					disableAll: "Disable All",
					save: "Save Default Config",
					saveSettings: "Save Default Settings",
					saving: "Saving...",
					refresh: "Refresh Skills",
					refreshing: "Refreshing...",
					viewDetails: "Expand",
					hideDetails: "Collapse"
				},
				summary: "{total} total skills available: {enabled} default enabled, {disabled} default disabled",
				searchPlaceholder: "Search skills by name or description...",
				empty: "No skills discovered in the current workspace. Add them under project root or ~/.dsh/skills.",
				noMatch: "No skills match the search filter.",
				notices: {
					saved: "Global default skill configuration saved successfully!",
					saveError: "Failed to save: ",
					refreshSuccess: "Skill list refreshed!"
				}
			}
		};
		function flattenDictionary(record, prefix = "") {
			const result = {};
			for (const [key, value] of Object.entries(record)) {
				const nextKey = prefix ? `${prefix}.${key}` : key;
				if (typeof value === "string") result[nextKey] = value;
				else if (value && typeof value === "object" && !Array.isArray(value)) Object.assign(result, flattenDictionary(value, nextKey));
			}
			return result;
		}
		//#endregion
		//#region src/client/types.ts
		function parseToolParameters$1(schema) {
			if (!schema || typeof schema !== "object") return [];
			const properties = schema.properties;
			if (!properties || typeof properties !== "object") return [];
			const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);
			const items = [];
			for (const [name, rawProp] of Object.entries(properties)) {
				if (!rawProp || typeof rawProp !== "object") {
					items.push({
						name,
						type: "any",
						required: requiredSet.has(name)
					});
					continue;
				}
				const prop = rawProp;
				let typeStr = prop.type || "any";
				if (prop.type === "array") typeStr = `array<${prop.items?.type || "any"}>`;
				else if (Array.isArray(prop.type)) typeStr = prop.type.join(" | ");
				items.push({
					name,
					type: typeStr,
					required: requiredSet.has(name),
					description: typeof prop.description === "string" ? prop.description : void 0,
					default: prop.default,
					enum: Array.isArray(prop.enum) ? prop.enum : void 0
				});
			}
			items.sort((a, b) => {
				if (a.required !== b.required) return a.required ? -1 : 1;
				return a.name.localeCompare(b.name);
			});
			return items;
		}
		const LOCALE_NS = "settings.sessionSettings";
		//#endregion
		//#region src/client/storage.ts
		const STORAGE_KEY = "dsh.session_settings_store";
		const MCP_STORAGE_KEY = "dsh.mcp_servers_store";
		const DEFAULT_SESSION_SETTINGS = {
			subagentModel: { mode: "inherit" },
			mcp: {
				mode: "default",
				enabledServerIds: [],
				toolsMode: {},
				disabledTools: {}
			},
			skills: {
				mode: "default",
				disabledSkills: []
			}
		};
		function getLocalSessionSettingsStore() {
			try {
				if (typeof localStorage !== "undefined") {
					const raw = localStorage.getItem(STORAGE_KEY);
					if (raw) {
						const parsed = JSON.parse(raw);
						if (parsed && typeof parsed === "object") return {
							default: parsed.default || { ...DEFAULT_SESSION_SETTINGS },
							sessions: parsed.sessions || {}
						};
					}
				}
			} catch {}
			return {
				default: { ...DEFAULT_SESSION_SETTINGS },
				sessions: {}
			};
		}
		function saveLocalSessionSettingsStore(store) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
			} catch {}
		}
		function getLocalMcpServers() {
			try {
				if (typeof localStorage !== "undefined") {
					const raw = localStorage.getItem(MCP_STORAGE_KEY);
					if (raw) {
						const parsed = JSON.parse(raw);
						if (Array.isArray(parsed)) return parsed;
					}
				}
			} catch {}
			return [];
		}
		function saveLocalMcpServers(servers) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(MCP_STORAGE_KEY, JSON.stringify(servers));
			} catch {}
		}
		function getSessionRawSettings(store, sessionId) {
			if (sessionId && store.sessions && store.sessions[sessionId]) {
				const s = store.sessions[sessionId];
				const hasOverride = s.subagentModel?.mode !== "default" || s.mcp?.mode !== "default" || s.skills?.mode !== "default";
				return {
					config: {
						subagentModel: s.subagentModel || { mode: "default" },
						mcp: {
							mode: s.mcp?.mode === "custom" ? "custom" : "default",
							enabledServerIds: s.mcp?.enabledServerIds || [],
							toolsMode: s.mcp?.toolsMode || {},
							disabledTools: s.mcp?.disabledTools || {}
						},
						skills: {
							mode: s.skills?.mode === "custom" ? "custom" : "default",
							disabledSkills: s.skills?.disabledSkills || []
						}
					},
					hasOverride
				};
			}
			return {
				config: {
					subagentModel: { mode: "default" },
					mcp: {
						mode: "default",
						enabledServerIds: [],
						toolsMode: {},
						disabledTools: {}
					},
					skills: {
						mode: "default",
						disabledSkills: []
					}
				},
				hasOverride: false
			};
		}
		function getSessionEffectiveSettings(store, availableMcpServers, sessionId) {
			const defaultSubagent = store.default?.subagentModel || { mode: "inherit" };
			const defaultMcpIds = availableMcpServers.filter((s) => s.enabledByDefault).map((s) => s.id);
			const defaultDisabledSkills = store.default?.skills?.disabledSkills || [];
			if (sessionId && store.sessions && store.sessions[sessionId]) {
				const s = store.sessions[sessionId];
				const subagent = s.subagentModel?.mode !== "default" ? s.subagentModel : defaultSubagent;
				const mcpMode = s.mcp?.mode === "custom" ? "custom" : "default";
				const enabledServerIds = mcpMode === "custom" ? s.mcp?.enabledServerIds || [] : (store.default?.mcp?.mode === "custom" ? store.default.mcp.enabledServerIds : defaultMcpIds) || defaultMcpIds;
				const toolsMode = mcpMode === "custom" ? s.mcp?.toolsMode || {} : store.default?.mcp?.toolsMode || {};
				const disabledTools = mcpMode === "custom" ? s.mcp?.disabledTools || {} : store.default?.mcp?.disabledTools || {};
				const effectiveDisabledTools = {};
				for (const srv of availableMcpServers) if (toolsMode[srv.id] === "custom" && disabledTools[srv.id]) effectiveDisabledTools[srv.id] = disabledTools[srv.id];
				else effectiveDisabledTools[srv.id] = srv.disabledTools || [];
				const skillsMode = s.skills?.mode === "custom" ? "custom" : "default";
				const disabledSkills = skillsMode === "custom" ? s.skills?.disabledSkills || [] : defaultDisabledSkills;
				return {
					subagentModel: subagent,
					mcp: {
						mode: mcpMode,
						enabledServerIds,
						toolsMode,
						disabledTools,
						effectiveDisabledTools
					},
					skills: {
						mode: skillsMode,
						disabledSkills,
						effectiveDisabledSkills: [...disabledSkills]
					}
				};
			}
			const defaultToolsMode = store.default?.mcp?.toolsMode || {};
			const defaultDisabledTools = store.default?.mcp?.disabledTools || {};
			const effectiveDisabledTools = {};
			for (const srv of availableMcpServers) if (defaultToolsMode[srv.id] === "custom" && defaultDisabledTools[srv.id]) effectiveDisabledTools[srv.id] = defaultDisabledTools[srv.id];
			else effectiveDisabledTools[srv.id] = srv.disabledTools || [];
			return {
				subagentModel: defaultSubagent,
				mcp: {
					mode: "default",
					enabledServerIds: defaultMcpIds,
					toolsMode: defaultToolsMode,
					disabledTools: defaultDisabledTools,
					effectiveDisabledTools
				},
				skills: {
					mode: "default",
					disabledSkills: defaultDisabledSkills,
					effectiveDisabledSkills: [...defaultDisabledSkills]
				}
			};
		}
		//#endregion
		//#region src/client/SkillsSettingsTab.ts
		const e$3 = react.createElement;
		function getSkillSourceMeta(skill, t) {
			if (!skill) return {
				sourceClass: "source-user",
				sourceLabel: t("sessionSettings.skills.sourceUser") || "用户技能"
			};
			const isRuntime = Boolean(skill.isRuntime);
			const source = (skill.source || "").toLowerCase();
			if (isRuntime) return {
				sourceClass: "source-runtime",
				sourceLabel: t("sessionSettings.skills.sourceRuntime") || t("sessionSettings.skills.runtimeBadge") || "运行时预设"
			};
			if (source.includes("project")) return {
				sourceClass: "source-project",
				sourceLabel: t("sessionSettings.skills.sourceProject") || "项目技能"
			};
			if (source.includes("user")) return {
				sourceClass: "source-user",
				sourceLabel: t("sessionSettings.skills.sourceUser") || "用户技能"
			};
			if (source === "bundled") return {
				sourceClass: "source-bundled",
				sourceLabel: t("sessionSettings.skills.sourceBundled") || "内置技能"
			};
			return {
				sourceClass: "source-runtime",
				sourceLabel: t("sessionSettings.skills.sourceRuntime") || t("sessionSettings.skills.runtimeBadge") || "运行时预设"
			};
		}
		function SkillsSettingsTab({ api: _api, t, close: _close }) {
			const localStore = getLocalSessionSettingsStore();
			const [skills, setSkills] = react.useState([]);
			const [defaultDisabledModelList, setDefaultDisabledModelList] = react.useState(localStore.default?.skills?.disabledModelSkills || localStore.default?.skills?.disabledSkills || []);
			const [defaultDisabledUserList, setDefaultDisabledUserList] = react.useState(localStore.default?.skills?.disabledUserSkills || []);
			const [loading, setLoading] = react.useState(true);
			const [saving, setSaving] = react.useState(false);
			const [search, setSearch] = react.useState("");
			const [error, setError] = react.useState("");
			const [successMsg, setSuccessMsg] = react.useState("");
			const [selectedSkillForModal, setSelectedSkillForModal] = react.useState(null);
			const [skillsContentMap, setSkillsContentMap] = react.useState({});
			const [skillsLoadingMap, setSkillsLoadingMap] = react.useState({});
			const defaultDisabledModelSet = react.useMemo(() => new Set(defaultDisabledModelList), [defaultDisabledModelList]);
			const defaultDisabledUserSet = react.useMemo(() => new Set(defaultDisabledUserList), [defaultDisabledUserList]);
			const nonRuntimeSkills = react.useMemo(() => skills.filter((s) => !s.isRuntime), [skills]);
			const enabledCount = react.useMemo(() => nonRuntimeSkills.filter((s) => !defaultDisabledModelSet.has(s.name)).length, [nonRuntimeSkills, defaultDisabledModelSet]);
			const loadSkills = async () => {
				setLoading(true);
				setError("");
				try {
					const res = await fetch("/api/session-settings");
					if (res.ok) {
						const data = await res.json();
						if (data?.ok) {
							if (Array.isArray(data.availableSkills)) setSkills(data.availableSkills);
							if (data.defaultConfig?.skills) {
								const mList = data.defaultConfig.skills.disabledModelSkills || data.defaultConfig.skills.disabledSkills || [];
								const uList = data.defaultConfig.skills.disabledUserSkills || [];
								setDefaultDisabledModelList(mList);
								setDefaultDisabledUserList(uList);
							}
							const freshStore = getLocalSessionSettingsStore();
							if (data.defaultConfig) {
								freshStore.default = data.defaultConfig;
								saveLocalSessionSettingsStore(freshStore);
							}
						}
					} else {
						const data = await res.json().catch(() => ({}));
						setError(t("notices.saveError") + " " + (data?.error || `HTTP ${res.status}`));
					}
				} catch (err) {
					setError(err?.message || String(err));
				} finally {
					setLoading(false);
				}
			};
			react.useEffect(() => {
				loadSkills();
			}, []);
			const handleToggleModelInvocable = (skillName) => {
				setSuccessMsg("");
				setError("");
				setDefaultDisabledModelList((prev) => prev.includes(skillName) ? prev.filter((n) => n !== skillName) : [...prev, skillName]);
			};
			const handleToggleUserInvocable = (skillName) => {
				setSuccessMsg("");
				setError("");
				setDefaultDisabledUserList((prev) => prev.includes(skillName) ? prev.filter((n) => n !== skillName) : [...prev, skillName]);
			};
			const handleSaveDefault = async () => {
				setSaving(true);
				setError("");
				setSuccessMsg("");
				const curStore = getLocalSessionSettingsStore();
				const payloadConfig = {
					subagentModel: curStore.default.subagentModel || { mode: "inherit" },
					mcp: curStore.default.mcp || {
						mode: "default",
						enabledServerIds: []
					},
					skills: {
						mode: "default",
						disabledSkills: defaultDisabledModelList,
						disabledModelSkills: defaultDisabledModelList,
						disabledUserSkills: defaultDisabledUserList
					}
				};
				try {
					const res = await fetch("/api/session-settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							config: payloadConfig,
							isDefault: true
						})
					});
					const data = await res.json();
					if (res.ok && data?.ok) {
						curStore.default = payloadConfig;
						saveLocalSessionSettingsStore(curStore);
						setSuccessMsg(t("notices.saved"));
						setTimeout(() => setSuccessMsg(""), 3500);
					} else setError(t("notices.saveError") + (data?.error || "Unknown error"));
				} catch (err) {
					setError(t("notices.saveError") + (err?.message || String(err)));
				} finally {
					setSaving(false);
				}
			};
			const handleOpenSkillModal = async (skill) => {
				setSelectedSkillForModal(skill);
				const skillName = skill.name;
				if (!skillsContentMap[skillName] && !skill.content) {
					setSkillsLoadingMap((prev) => ({
						...prev,
						[skillName]: true
					}));
					try {
						const res = await fetch(`/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}`);
						if (res.ok) {
							const data = await res.json();
							if (data?.ok && data.skill) setSkillsContentMap((prev) => ({
								...prev,
								[skillName]: data.skill
							}));
							else setSkillsContentMap((prev) => ({
								...prev,
								[skillName]: {
									...skill,
									content: "（暂未获取到该技能的详细指令内容）"
								}
							}));
						} else setSkillsContentMap((prev) => ({
							...prev,
							[skillName]: {
								...skill,
								content: "（加载技能详细指令失败）"
							}
						}));
					} catch (err) {
						setSkillsContentMap((prev) => ({
							...prev,
							[skillName]: {
								...skill,
								content: `（加载出错: ${err?.message || String(err)}）`
							}
						}));
					} finally {
						setSkillsLoadingMap((prev) => ({
							...prev,
							[skillName]: false
						}));
					}
				}
			};
			const filteredSkills = skills.filter((s) => {
				if (!search.trim()) return true;
				const q = search.trim().toLowerCase();
				return s.name.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q) || (s.source || "").toLowerCase().includes(q) || (s.provider || "").toLowerCase().includes(q);
			});
			const modalSkill = selectedSkillForModal;
			const modalDetail = modalSkill ? skillsContentMap[modalSkill.name] || modalSkill : null;
			const modalIsRuntime = modalSkill ? Boolean(modalSkill.isRuntime) : false;
			const modalIsModelDisabled = modalSkill ? defaultDisabledModelSet.has(modalSkill.name) : false;
			const modalIsUserDisabled = modalSkill ? defaultDisabledUserSet.has(modalSkill.name) : false;
			const modalIsLoadingContent = modalSkill ? Boolean(skillsLoadingMap[modalSkill.name]) : false;
			const { sourceClass: modalSourceClass, sourceLabel: modalSourceLabel } = getSkillSourceMeta(modalSkill, t);
			return e$3("div", { className: "dsh-sam-page dsh-mcp-settings-page" }, error ? e$3("div", { className: "dsh-sam-notice error" }, error) : null, successMsg ? e$3("div", { className: "dsh-sam-notice success" }, successMsg) : null, e$3("div", { className: "dsh-mcp-header-card" }, e$3("div", { className: "dsh-mcp-header-title-row" }, e$3("div", null, e$3("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px"
			} }, e$3(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 18 }), e$3("h2", { className: "dsh-mcp-page-title" }, t("title") || "技能管理")), e$3("p", { className: "dsh-mcp-page-desc" }, t("desc") || "配置所有新会话默认生效的 Skill 启用/禁用规则。支持分别独立管控模型的 tool-skill 工具调用与用户的 /快捷指令。")), e$3("div", { className: "dsh-mcp-header-actions" }, e$3("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				title: t("sessionSettings.skills.refresh") || "刷新技能",
				onClick: loadSkills
			}, e$3(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 14 })), e$3("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				disabled: saving,
				onClick: handleSaveDefault
			}, saving ? t("notices.saving") : t("actions.saveSettings") || "保存设置")))), loading ? e$3("div", { className: "dsh-mcp-loading-card" }, e$3("p", null, t("sessionSettings.skills.refreshing"))) : e$3("div", { className: "dsh-mcp-body-wrap" }, e$3("div", { className: "dsh-mcp-tools-toolbar" }, e$3("div", { className: "dsh-mcp-tools-search-box" }, e$3("div", { className: "dsh-mcp-search-wrap" }, e$3(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {
				size: 14,
				className: "dsh-mcp-search-icon"
			}), e$3("input", {
				type: "text",
				className: "dsh-mcp-search-input",
				placeholder: t("sessionSettings.skills.searchPlaceholder"),
				value: search,
				onChange: (evt) => setSearch(evt.target.value)
			})))), e$3("div", { className: "dsh-mcp-tools-stats-bar" }, e$3("span", null, t("sessionSettings.skills.effectiveInfoDefault", {
				total: nonRuntimeSkills.length,
				enabled: enabledCount
			})), search.trim() ? e$3("span", null, `匹配到 ${filteredSkills.length} / ${skills.length} 个技能`) : null), filteredSkills.length === 0 ? e$3("div", { className: "dsh-mcp-empty-card" }, e$3("p", { className: "dsh-mcp-empty-text" }, t("sessionSettings.skills.noMatch"))) : e$3("div", { className: "dsh-session-skills-list" }, filteredSkills.map((skill) => {
				const isModelDisabled = defaultDisabledModelSet.has(skill.name);
				const isUserDisabled = defaultDisabledUserSet.has(skill.name);
				const isRuntime = Boolean(skill.isRuntime);
				const { sourceClass, sourceLabel } = getSkillSourceMeta(skill, t);
				return e$3("div", {
					key: skill.name,
					className: `dsh-session-skill-item ${!isModelDisabled ? "active" : "disabled"}`,
					onClick: () => handleOpenSkillModal(skill),
					style: { cursor: "pointer" }
				}, e$3("div", { className: "dsh-session-skill-main" }, e$3("div", { className: "dsh-session-skill-info" }, e$3("div", { className: "dsh-session-skill-row1" }, e$3("div", { className: "dsh-session-skill-title-wrap" }, e$3(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 14 }), e$3("span", { className: "dsh-session-skill-name" }, skill.name), e$3("span", { className: `dsh-skill-badge ${sourceClass}` }, sourceLabel), isRuntime ? null : e$3("span", { className: `dsh-skill-badge ${!isModelDisabled ? "status-enabled" : "status-disabled"}` }, !isModelDisabled ? t("sessionSettings.skills.modelInvocableEnabled") || "模型调用: 开启" : t("sessionSettings.skills.modelInvocableDisabled") || "模型调用: 禁用"), isRuntime ? null : e$3("span", { className: `dsh-skill-badge ${!isUserDisabled ? "status-enabled" : "status-disabled"}` }, !isUserDisabled ? t("sessionSettings.skills.userInvocableEnabled") || "快捷指令: 开启" : t("sessionSettings.skills.userInvocableDisabled") || "快捷指令: 禁用"))), skill.description ? e$3("p", { className: "dsh-session-skill-desc" }, skill.description) : null), e$3("div", { className: "dsh-skill-actions" }, e$3("button", {
					type: "button",
					className: "dsh-skill-config-btn",
					onClick: (evt) => {
						evt.stopPropagation();
						handleOpenSkillModal(skill);
					}
				}, t("sessionSettings.skills.openModalBtn") || "配置 / 详情"))));
			}))), modalSkill && modalDetail ? e$3("div", {
				className: "dsh-sam-modal-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setSelectedSkillForModal(null);
				}
			}, e$3("div", { className: "dsh-sam-modal-panel dsh-skill-modal" }, e$3("div", { className: "dsh-sam-header-row" }, e$3("div", { className: "dsh-mcp-tools-header-info" }, e$3("h3", {
				className: "dsh-sam-title",
				style: {
					display: "flex",
					alignItems: "center",
					gap: "8px"
				}
			}, e$3(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 18 }), modalSkill.name), e$3("div", { className: "dsh-skill-modal-header-meta" }, e$3("span", { className: `dsh-skill-badge ${modalSourceClass}` }, modalSourceLabel), !modalIsRuntime ? e$3("span", { className: `dsh-skill-badge ${!modalIsModelDisabled ? "status-enabled" : "status-disabled"}` }, !modalIsModelDisabled ? t("sessionSettings.skills.modelInvocableEnabled") || "模型调用: 开启" : t("sessionSettings.skills.modelInvocableDisabled") || "模型调用: 禁用") : null, !modalIsRuntime ? e$3("span", { className: `dsh-skill-badge ${!modalIsUserDisabled ? "status-enabled" : "status-disabled"}` }, !modalIsUserDisabled ? t("sessionSettings.skills.userInvocableEnabled") || "快捷指令: 开启" : t("sessionSettings.skills.userInvocableDisabled") || "快捷指令: 禁用") : null)), e$3("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setSelectedSkillForModal(null)
			}, e$3(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$3("div", { className: "dsh-skill-modal-body" }, modalSkill.description ? e$3("p", { className: "dsh-skill-modal-desc" }, modalSkill.description) : null, modalIsRuntime ? e$3("div", { className: "dsh-skill-runtime-note" }, t("sessionSettings.skills.runtimeNotice")) : null, modalDetail.path ? e$3("div", { className: "dsh-skill-detail-meta" }, e$3("span", null, t("sessionSettings.skills.pathLabel"), e$3("code", { className: "dsh-skill-detail-path" }, modalDetail.path))) : null, modalDetail.whenToUse ? e$3("div", { className: "dsh-skill-detail-meta" }, e$3("span", null, t("sessionSettings.skills.whenToUseLabel"), modalDetail.whenToUse)) : null, e$3("div", { className: "dsh-skill-modal-section" }, e$3("h4", { className: "dsh-skill-modal-section-title" }, t("sessionSettings.skills.rulesSectionTitle") || "调用权限管控"), !modalIsRuntime ? e$3("div", { style: {
				display: "flex",
				flexDirection: "column",
				gap: "8px"
			} }, e$3("div", {
				className: `dsh-mcp-switch-card mini ${!modalIsModelDisabled ? "active" : ""}`,
				onClick: () => handleToggleModelInvocable(modalSkill.name),
				style: { cursor: "pointer" }
			}, e$3("div", { className: "dsh-mcp-switch-text" }, e$3("span", { className: "dsh-mcp-switch-title" }, t("sessionSettings.skills.modelInvocableTitle")), e$3("span", { className: "dsh-mcp-switch-desc" }, t("sessionSettings.skills.modelInvocableDesc"))), e$3("div", { className: `dsh-mcp-switch-btn ${!modalIsModelDisabled ? "active" : ""}` }, e$3("span", { className: "dsh-mcp-switch-thumb" }))), e$3("div", {
				className: `dsh-mcp-switch-card mini ${!modalIsUserDisabled ? "active" : ""}`,
				onClick: () => handleToggleUserInvocable(modalSkill.name),
				style: { cursor: "pointer" }
			}, e$3("div", { className: "dsh-mcp-switch-text" }, e$3("span", { className: "dsh-mcp-switch-title" }, t("sessionSettings.skills.userInvocableTitle")), e$3("span", { className: "dsh-mcp-switch-desc" }, t("sessionSettings.skills.userInvocableDesc"))), e$3("div", { className: `dsh-mcp-switch-btn ${!modalIsUserDisabled ? "active" : ""}` }, e$3("span", { className: "dsh-mcp-switch-thumb" })))) : null), e$3("div", { className: "dsh-skill-modal-section" }, e$3("h4", { className: "dsh-skill-modal-section-title" }, t("sessionSettings.skills.instructionsSectionTitle") || "指令与规则"), modalIsLoadingContent ? e$3("div", { className: "dsh-sam-notice info" }, t("sessionSettings.skills.loadingContent")) : e$3("pre", { className: "dsh-skill-content-block" }, modalDetail.content || t("sessionSettings.skills.noInstructions")))), e$3("div", { className: "dsh-sam-actions dsh-mcp-modal-footer" }, e$3("div", { className: "dsh-mcp-modal-footer-left" }), e$3("div", { className: "dsh-mcp-modal-footer-right" }, e$3("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				onClick: () => setSelectedSkillForModal(null)
			}, t("sessionSettings.skills.modalDoneBtn") || "完成"))))) : null);
		}
		//#endregion
		//#region src/client/SessionSettingsViewPage.ts
		const e$2 = react.createElement;
		function capitalize(s) {
			if (!s) return "";
			return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
		}
		function effortLabel(t, effortId) {
			const translated = t(`sessionSettings.field.reasoning${capitalize(effortId)}`);
			return translated && !translated.startsWith("sessionSettings.field.") ? translated : effortId;
		}
		function SessionSettingsViewPage({ api, t, sessionId, sessionTitle: _sessionTitle, useSessions, onSave }) {
			const localStore = getLocalSessionSettingsStore();
			const localServers = getLocalMcpServers();
			const initialRaw = getSessionRawSettings(localStore, sessionId);
			const initialEffective = getSessionEffectiveSettings(localStore, localServers, sessionId);
			const [activeNav, setActiveNav] = react.useState("model");
			const [saving, setSaving] = react.useState(false);
			const [savingDefault, setSavingDefault] = react.useState(false);
			const [saveSuccessMsg, setSaveSuccessMsg] = react.useState("");
			const [error, setError] = react.useState("");
			const [copiedId, setCopiedId] = react.useState(false);
			const [cloneSourceId, setCloneSourceId] = react.useState("");
			const [cloning, setCloning] = react.useState(false);
			const [cloneError, setCloneError] = react.useState("");
			const [providers, setProviders] = react.useState([]);
			const [availableMcpServers, setAvailableMcpServers] = react.useState(localServers);
			const [availableSkills, setAvailableSkills] = react.useState([]);
			const [modelConfig, setModelConfig] = react.useState(sessionId ? initialRaw.config.subagentModel : initialEffective.subagentModel);
			const [mcpConfig, setMcpConfig] = react.useState(sessionId ? initialRaw.config.mcp : initialEffective.mcp);
			const [skillsConfig, setSkillsConfig] = react.useState(sessionId ? initialRaw.config.skills : initialEffective.skills);
			const [skillsSearch, setSkillsSearch] = react.useState("");
			const [sessionSkillModalTarget, setSessionSkillModalTarget] = react.useState(null);
			const [skillsContentMap, setSkillsContentMap] = react.useState({});
			const [skillsLoadingMap, setSkillsLoadingMap] = react.useState({});
			const [refreshingSkills, setRefreshingSkills] = react.useState(false);
			const [sessionToolsModalServer, setSessionToolsModalServer] = react.useState(null);
			const [sessionToolsMode, setSessionToolsMode] = react.useState("default");
			const [sessionDisabledToolsSet, setSessionDisabledToolsSet] = react.useState(/* @__PURE__ */ new Set());
			const [sessionToolsSearch, setSessionToolsSearch] = react.useState("");
			const [sessionToolsExpandedSchemas, setSessionToolsExpandedSchemas] = react.useState(/* @__PURE__ */ new Set());
			const [sessionToolSchemaModes, setSessionToolSchemaModes] = react.useState({});
			const [sessionToolsFetching, setSessionToolsFetching] = react.useState(false);
			const [sessionToolsList, setSessionToolsList] = react.useState([]);
			const [defaultSettings, setDefaultSettings] = react.useState(localStore.default || {
				subagentModel: { mode: "inherit" },
				mcp: {
					mode: "default",
					enabledServerIds: []
				},
				skills: {
					mode: "default",
					disabledSkills: []
				}
			});
			const [hasSessionOverride, setHasSessionOverride] = react.useState(initialRaw.hasOverride);
			const apiRef = react.useRef(api);
			apiRef.current = api;
			const sessionsMap = typeof useSessions === "function" ? useSessions((s) => s?.byId || {}) : {};
			react.useEffect(() => {
				let mounted = true;
				const curStore = getLocalSessionSettingsStore();
				const curServers = getLocalMcpServers();
				const curRaw = getSessionRawSettings(curStore, sessionId);
				const curEffective = getSessionEffectiveSettings(curStore, curServers, sessionId);
				setModelConfig(sessionId ? curRaw.config.subagentModel : curEffective.subagentModel);
				setMcpConfig(sessionId ? curRaw.config.mcp : curEffective.mcp);
				setSkillsConfig(sessionId ? curRaw.config.skills : curEffective.skills);
				setDefaultSettings(curStore.default);
				setHasSessionOverride(curRaw.hasOverride);
				setSaveSuccessMsg("");
				setError("");
				setCloneError("");
				async function loadData() {
					try {
						try {
							const clientApi = apiRef.current;
							if (clientApi?.llm?.models) {
								const modelsRes = await clientApi.llm.models({});
								if (mounted && modelsRes?.result?.ok && modelsRes.result.value?.groups) setProviders(modelsRes.result.value.groups);
							}
						} catch {}
						try {
							const url = sessionId ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}` : "/api/session-settings";
							const res = await fetch(url);
							if (res.ok) {
								const data = await res.json();
								if (mounted && data?.ok) {
									const freshStore = getLocalSessionSettingsStore();
									if (data.defaultConfig) {
										freshStore.default = data.defaultConfig;
										setDefaultSettings(data.defaultConfig);
										if (!sessionId) {
											setModelConfig(data.defaultConfig.subagentModel);
											setMcpConfig(data.defaultConfig.mcp);
											setSkillsConfig(data.defaultConfig.skills);
										}
									}
									if (Array.isArray(data.availableMcpServers)) {
										setAvailableMcpServers(data.availableMcpServers);
										saveLocalMcpServers(data.availableMcpServers);
									}
									if (Array.isArray(data.availableSkills)) setAvailableSkills(data.availableSkills);
									if (sessionId && data.config) {
										freshStore.sessions[sessionId] = data.config;
										setModelConfig(data.config.subagentModel || { mode: "default" });
										setMcpConfig(data.config.mcp || {
											mode: "default",
											enabledServerIds: []
										});
										setSkillsConfig(data.config.skills || {
											mode: "default",
											disabledSkills: []
										});
										setHasSessionOverride(Boolean(data.hasSessionOverride));
									}
									saveLocalSessionSettingsStore(freshStore);
								}
							}
						} catch {}
					} catch (err) {
						if (mounted) setError(err?.message || String(err));
					}
				}
				loadData();
				return () => {
					mounted = false;
				};
			}, [sessionId]);
			const handleCopySessionId = async () => {
				if (!sessionId) return;
				try {
					if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(sessionId);
					else {
						const textarea = document.createElement("textarea");
						textarea.value = sessionId;
						document.body.appendChild(textarea);
						textarea.select();
						document.execCommand("copy");
						textarea.remove();
					}
					setCopiedId(true);
					setTimeout(() => setCopiedId(false), 2e3);
				} catch {}
			};
			const handleClonePreset = async () => {
				const targetSourceId = cloneSourceId.trim();
				if (!targetSourceId) return;
				setCloning(true);
				setCloneError("");
				setSaveSuccessMsg("");
				try {
					const res = await fetch(`/api/session-settings?sessionId=${encodeURIComponent(targetSourceId)}`);
					if (!res.ok) {
						setCloneError(t("sessionSettings.clone.error"));
						return;
					}
					const data = await res.json();
					if (data && data.ok) {
						const sourceConfig = data.config?.subagentModel?.mode !== "default" || data.config?.mcp?.mode !== "default" || data.config?.skills?.mode !== "default" ? data.config : data.effectiveConfig;
						if (sourceConfig.subagentModel) setModelConfig(sourceConfig.subagentModel);
						if (sourceConfig.mcp) setMcpConfig(sourceConfig.mcp);
						if (sourceConfig.skills) setSkillsConfig(sourceConfig.skills);
						const sourceTitle = sessionsMap[targetSourceId]?.title || sessionsMap[targetSourceId]?.header?.title || targetSourceId;
						setCloneSourceId("");
						setSaveSuccessMsg(t("sessionSettings.clone.success", { name: sourceTitle }));
					} else setCloneError(t("sessionSettings.clone.error"));
				} catch (err) {
					setCloneError(t("sessionSettings.clone.error") + ": " + (err?.message || String(err)));
				} finally {
					setCloning(false);
				}
			};
			const handleModelModeChange = (mode) => {
				setSaveSuccessMsg("");
				setError("");
				if (mode === "custom" && !modelConfig.provider && providers.length > 0) {
					const firstGroup = providers[0];
					const firstModel = firstGroup.models?.[0]?.id || "";
					setModelConfig({
						mode: "custom",
						provider: firstGroup.id,
						model: firstModel,
						reasoningEffort: void 0
					});
				} else setModelConfig({
					...modelConfig,
					mode
				});
			};
			const handleProviderChange = (providerId) => {
				setSaveSuccessMsg("");
				setError("");
				const firstModel = providers.find((g) => g.id === providerId)?.models?.[0]?.id || "";
				setModelConfig({
					...modelConfig,
					provider: providerId,
					model: firstModel,
					reasoningEffort: void 0
				});
			};
			const handleModelSelectChange = (modelId) => {
				setSaveSuccessMsg("");
				setError("");
				const supportedEfforts = (providers.find((g) => g.id === modelConfig.provider)?.models?.find((m) => m.id === modelId))?.reasoning?.efforts || [];
				const isEffortValid = modelConfig.reasoningEffort && supportedEfforts.some((e) => e.id === modelConfig.reasoningEffort);
				setModelConfig({
					...modelConfig,
					model: modelId,
					reasoningEffort: isEffortValid ? modelConfig.reasoningEffort : void 0
				});
			};
			const handleReasoningEffortChange = (effortId) => {
				setSaveSuccessMsg("");
				setError("");
				setModelConfig({
					...modelConfig,
					reasoningEffort: effortId.trim() ? effortId.trim() : void 0
				});
			};
			const handleMcpModeChange = (mode) => {
				setSaveSuccessMsg("");
				setError("");
				if (mode === "custom" && (!mcpConfig.enabledServerIds || mcpConfig.enabledServerIds.length === 0)) {
					const initialIds = availableMcpServers.filter((s) => s.enabledByDefault).map((s) => s.id);
					setMcpConfig({
						mode: "custom",
						enabledServerIds: initialIds
					});
				} else setMcpConfig({
					...mcpConfig,
					mode
				});
			};
			const handleToggleMcpServer = (serverId) => {
				setSaveSuccessMsg("");
				setError("");
				const currentIds = mcpConfig.enabledServerIds || [];
				const nextIds = currentIds.includes(serverId) ? currentIds.filter((id) => id !== serverId) : [...currentIds, serverId];
				setMcpConfig({
					...mcpConfig,
					mode: "custom",
					enabledServerIds: nextIds
				});
			};
			const handleSelectAllMcp = () => {
				setMcpConfig({
					mode: "custom",
					enabledServerIds: availableMcpServers.map((s) => s.id)
				});
			};
			const handleDeselectAllMcp = () => {
				setMcpConfig({
					mode: "custom",
					enabledServerIds: []
				});
			};
			const isAllMcpSelected = availableMcpServers.length > 0 && (mcpConfig.mode === "custom" || !sessionId ? availableMcpServers.every((s) => (mcpConfig.enabledServerIds || []).includes(s.id)) : availableMcpServers.every((s) => s.enabledByDefault));
			const handleToggleSelectAllMcp = () => {
				if (isAllMcpSelected) handleDeselectAllMcp();
				else handleSelectAllMcp();
			};
			const handleOpenSessionToolsModal = async (server) => {
				setSessionToolsModalServer(server);
				const currentToolsMode = mcpConfig.toolsMode?.[server.id] || "default";
				setSessionToolsMode(currentToolsMode);
				if (currentToolsMode === "custom") setSessionDisabledToolsSet(new Set(mcpConfig.disabledTools?.[server.id] || []));
				else setSessionDisabledToolsSet(new Set(server.disabledTools || []));
				setSessionToolsSearch("");
				setSessionToolsExpandedSchemas(/* @__PURE__ */ new Set());
				setSessionToolSchemaModes({});
				let tools = [];
				if (server.toolDetails && server.toolDetails.length > 0) tools = server.toolDetails;
				else if (server.tools && server.tools.length > 0) tools = server.tools.map((name) => ({ name }));
				setSessionToolsList(tools);
				if (tools.length === 0) {
					setSessionToolsFetching(true);
					try {
						const data = await (await fetch(`/api/mcp-servers?action=tools&id=${encodeURIComponent(server.id)}`, { method: "POST" })).json();
						if (data.ok && (data.toolDetails || data.tools)) {
							const fetchedTools = data.toolDetails || (data.tools || []).map((name) => ({ name }));
							setSessionToolsList(fetchedTools);
							setAvailableMcpServers((prev) => prev.map((s) => s.id === server.id ? {
								...s,
								tools: data.tools,
								toolDetails: data.toolDetails
							} : s));
						}
					} catch {}
					setSessionToolsFetching(false);
				}
			};
			const handleFetchSessionTools = async () => {
				if (!sessionToolsModalServer) return;
				setSessionToolsFetching(true);
				try {
					const data = await (await fetch(`/api/mcp-servers?action=tools&id=${encodeURIComponent(sessionToolsModalServer.id)}`, { method: "POST" })).json();
					if (data.ok && (data.toolDetails || data.tools)) {
						const fetchedTools = data.toolDetails || (data.tools || []).map((name) => ({ name }));
						setSessionToolsList(fetchedTools);
						setAvailableMcpServers((prev) => prev.map((s) => s.id === sessionToolsModalServer.id ? {
							...s,
							tools: data.tools,
							toolDetails: data.toolDetails
						} : s));
					}
				} catch {}
				setSessionToolsFetching(false);
			};
			const handleToggleSessionTool = (toolName) => {
				setSessionDisabledToolsSet((prev) => {
					const next = new Set(prev);
					if (next.has(toolName)) next.delete(toolName);
					else next.add(toolName);
					return next;
				});
			};
			const handleToggleAllSessionTools = (enableAll) => {
				if (enableAll) setSessionDisabledToolsSet(/* @__PURE__ */ new Set());
				else setSessionDisabledToolsSet(new Set(sessionToolsList.map((t) => t.name)));
			};
			const handleResetSessionToolsToDefault = () => {
				if (!sessionToolsModalServer) return;
				setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
			};
			const handleToggleSessionSchema = (toolName) => {
				setSessionToolsExpandedSchemas((prev) => {
					const next = new Set(prev);
					if (next.has(toolName)) next.delete(toolName);
					else next.add(toolName);
					return next;
				});
			};
			const handleApplySessionTools = () => {
				if (!sessionToolsModalServer) return;
				const serverId = sessionToolsModalServer.id;
				const nextToolsMode = { ...mcpConfig.toolsMode || {} };
				const nextDisabledTools = { ...mcpConfig.disabledTools || {} };
				if (sessionToolsMode === "custom") {
					nextToolsMode[serverId] = "custom";
					nextDisabledTools[serverId] = Array.from(sessionDisabledToolsSet);
				} else {
					nextToolsMode[serverId] = "default";
					delete nextDisabledTools[serverId];
				}
				const currentEnabled = mcpConfig.enabledServerIds || [];
				const nextEnabled = currentEnabled.includes(serverId) ? currentEnabled : [...currentEnabled, serverId];
				setMcpConfig({
					...mcpConfig,
					mode: sessionId ? "custom" : mcpConfig.mode,
					enabledServerIds: nextEnabled,
					toolsMode: nextToolsMode,
					disabledTools: nextDisabledTools
				});
				setSessionToolsModalServer(null);
			};
			const defaultDisabledModelSkills = defaultSettings.skills?.disabledModelSkills || defaultSettings.skills?.disabledSkills || [];
			const defaultDisabledUserSkills = defaultSettings.skills?.disabledUserSkills || [];
			const effectiveDisabledModelList = skillsConfig.mode === "custom" ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || [] : defaultDisabledModelSkills;
			const effectiveDisabledUserList = skillsConfig.mode === "custom" ? skillsConfig.disabledUserSkills || [] : defaultDisabledUserSkills;
			const effectiveDisabledModelSet = new Set(effectiveDisabledModelList);
			const effectiveDisabledUserSet = new Set(effectiveDisabledUserList);
			const effectiveActiveSkillsCount = availableSkills.filter((s) => !effectiveDisabledModelSet.has(s.name)).length;
			const handleSkillsModeChange = (mode) => {
				setSaveSuccessMsg("");
				setError("");
				if (mode === "custom") setSkillsConfig({
					mode: "custom",
					disabledSkills: [...effectiveDisabledModelList],
					disabledModelSkills: [...effectiveDisabledModelList],
					disabledUserSkills: [...effectiveDisabledUserList]
				});
				else setSkillsConfig({
					...skillsConfig,
					mode
				});
			};
			const handleToggleModelInvocable = (skillName) => {
				setSaveSuccessMsg("");
				setError("");
				const curModel = skillsConfig.mode === "custom" ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || [] : defaultDisabledModelSkills;
				const curUser = skillsConfig.mode === "custom" ? skillsConfig.disabledUserSkills || [] : defaultDisabledUserSkills;
				const nextModel = curModel.includes(skillName) ? curModel.filter((n) => n !== skillName) : [...curModel, skillName];
				setSkillsConfig({
					mode: "custom",
					disabledSkills: nextModel,
					disabledModelSkills: nextModel,
					disabledUserSkills: curUser
				});
			};
			const handleToggleUserInvocable = (skillName) => {
				setSaveSuccessMsg("");
				setError("");
				const curModel = skillsConfig.mode === "custom" ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || [] : defaultDisabledModelSkills;
				const curUser = skillsConfig.mode === "custom" ? skillsConfig.disabledUserSkills || [] : defaultDisabledUserSkills;
				const nextUser = curUser.includes(skillName) ? curUser.filter((n) => n !== skillName) : [...curUser, skillName];
				setSkillsConfig({
					mode: "custom",
					disabledSkills: curModel,
					disabledModelSkills: curModel,
					disabledUserSkills: nextUser
				});
			};
			const handleOpenSessionSkillModal = async (skill) => {
				setSessionSkillModalTarget(skill);
				const skillName = skill.name;
				if (!skillsContentMap[skillName] && !skill.content) {
					setSkillsLoadingMap((prev) => ({
						...prev,
						[skillName]: true
					}));
					try {
						const url = sessionId ? `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}&sessionId=${encodeURIComponent(sessionId)}` : `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}`;
						const res = await fetch(url);
						if (res.ok) {
							const data = await res.json();
							if (data?.ok && data.skill) setSkillsContentMap((prev) => ({
								...prev,
								[skillName]: data.skill
							}));
							else setSkillsContentMap((prev) => ({
								...prev,
								[skillName]: {
									...skill,
									content: "（暂未获取到该技能的详细指令内容）"
								}
							}));
						} else setSkillsContentMap((prev) => ({
							...prev,
							[skillName]: {
								...skill,
								content: "（加载技能详细指令失败）"
							}
						}));
					} catch (err) {
						setSkillsContentMap((prev) => ({
							...prev,
							[skillName]: {
								...skill,
								content: `（加载出错: ${err?.message || String(err)}）`
							}
						}));
					} finally {
						setSkillsLoadingMap((prev) => ({
							...prev,
							[skillName]: false
						}));
					}
				}
			};
			const handleRefreshSkills = async () => {
				setRefreshingSkills(true);
				try {
					const url = sessionId ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}` : "/api/session-settings";
					const res = await fetch(url);
					if (res.ok) {
						const data = await res.json();
						if (data?.ok && Array.isArray(data.availableSkills)) setAvailableSkills(data.availableSkills);
					}
				} catch {}
				setRefreshingSkills(false);
			};
			const handleSave = async (isSaveDefault = false) => {
				if (isSaveDefault) setSavingDefault(true);
				else setSaving(true);
				setSaveSuccessMsg("");
				setError("");
				const payloadConfig = {
					subagentModel: modelConfig,
					mcp: mcpConfig,
					skills: skillsConfig
				};
				try {
					const res = await fetch("/api/session-settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							sessionId,
							config: payloadConfig,
							isDefault: isSaveDefault
						})
					});
					const data = await res.json();
					if (res.ok && data?.ok) {
						const freshStore = getLocalSessionSettingsStore();
						if (isSaveDefault) {
							freshStore.default = payloadConfig;
							if (sessionId) delete freshStore.sessions[sessionId];
							setDefaultSettings(payloadConfig);
							setHasSessionOverride(false);
							setSaveSuccessMsg(t("sessionSettings.notice.savedDefault"));
						} else if (sessionId) {
							freshStore.sessions[sessionId] = payloadConfig;
							setHasSessionOverride(payloadConfig.subagentModel.mode !== "default" || payloadConfig.mcp.mode !== "default" || payloadConfig.skills.mode !== "default");
							setSaveSuccessMsg(t("sessionSettings.notice.saved"));
						}
						saveLocalSessionSettingsStore(freshStore);
						if (onSave) onSave(payloadConfig);
						setTimeout(() => setSaveSuccessMsg(""), 3e3);
					} else setError(t("sessionSettings.notice.error") + (data?.error || "Unknown error"));
				} catch (err) {
					setError(t("sessionSettings.notice.error") + (err?.message || String(err)));
				} finally {
					setSaving(false);
					setSavingDefault(false);
				}
			};
			const handleResetSession = async () => {
				if (!sessionId) return;
				setSaving(true);
				setSaveSuccessMsg("");
				setError("");
				try {
					const res = await fetch(`/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`, { method: "DELETE" });
					const data = await res.json();
					if (res.ok && data?.ok) {
						const freshStore = getLocalSessionSettingsStore();
						delete freshStore.sessions[sessionId];
						saveLocalSessionSettingsStore(freshStore);
						setModelConfig({ mode: "default" });
						setMcpConfig({
							mode: "default",
							enabledServerIds: []
						});
						setSkillsConfig({
							mode: "default",
							disabledSkills: []
						});
						setHasSessionOverride(false);
						setSaveSuccessMsg(t("sessionSettings.notice.saved"));
						if (onSave) onSave(freshStore.default);
						setTimeout(() => setSaveSuccessMsg(""), 3e3);
					}
				} catch (err) {
					setError(err?.message || String(err));
				} finally {
					setSaving(false);
				}
			};
			const currentProviderGroup = providers.find((g) => g.id === modelConfig.provider);
			const availableEfforts = (currentProviderGroup?.models?.find((m) => m.id === modelConfig.model))?.reasoning?.efforts || [];
			const effectiveActiveMcpCount = mcpConfig.mode === "custom" ? (mcpConfig.enabledServerIds || []).length : availableMcpServers.filter((s) => s.enabledByDefault).length;
			return e$2("div", {
				className: "dsh-session-view-root",
				"data-session-settings-view": "",
				"data-conversation-composer-overlay": ""
			}, e$2("div", { className: "dsh-session-view-header" }, e$2("div", { className: "dsh-session-view-header-left" }, e$2("h2", { className: "dsh-session-view-title" }, t("sessionSettings.title")), sessionId ? e$2("button", {
				type: "button",
				className: `dsh-session-id-chip ${copiedId ? "copied" : ""}`,
				onClick: handleCopySessionId,
				title: t("sessionSettings.action.copyId")
			}, copiedId ? e$2(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { size: 13 }) : e$2(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 13 }), e$2("span", null, copiedId ? t("sessionSettings.idCopied") : sessionId)) : null, sessionId ? e$2("span", { className: `dsh-sam-status-badge badge-${hasSessionOverride ? "custom" : "default"}` }, hasSessionOverride ? t("sessionSettings.scope.sessionCustom") : t("sessionSettings.scope.sessionDefault")) : null), sessionId ? e$2("div", { className: "dsh-clone-toolbar" }, e$2("span", { className: "dsh-clone-label" }, t("sessionSettings.clone.toolbarTitle")), e$2("input", {
				type: "text",
				className: "dsh-clone-input",
				placeholder: t("sessionSettings.clone.inputPlaceholder"),
				value: cloneSourceId,
				onChange: (evt) => setCloneSourceId(evt.target.value),
				onKeyDown: (evt) => {
					if (evt.key === "Enter") handleClonePreset();
				}
			}), e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary dsh-clone-btn",
				disabled: cloning || !cloneSourceId.trim(),
				onClick: handleClonePreset
			}, cloning ? e$2(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
				size: 13,
				className: "dsh-spin"
			}) : e$2(_deepseek_ai_dsh_client_ui_primitives.IconBranchOutline16, {
				size: 13,
				className: "dsh-btn-icon-left"
			}), cloning ? t("sessionSettings.clone.loading") : t("sessionSettings.clone.applyBtn"))) : null), saveSuccessMsg ? e$2("div", { className: "dsh-sam-notice success dsh-view-notice" }, saveSuccessMsg) : null, error || cloneError ? e$2("div", { className: "dsh-sam-notice error dsh-view-notice" }, error || cloneError) : null, e$2("div", { className: "dsh-session-view-body" }, e$2("div", { className: "dsh-session-view-sidebar" }, e$2("button", {
				type: "button",
				className: `dsh-view-sidebar-item ${activeNav === "model" ? "active" : ""}`,
				onClick: () => setActiveNav("model")
			}, e$2("div", { className: "dsh-view-item-icon" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16, { size: 16 })), e$2("span", { className: "dsh-view-item-title" }, t("sessionSettings.nav.modelTitle")), e$2("span", { className: "dsh-view-item-badge" }, modelConfig.mode === "custom" && modelConfig.model ? modelConfig.model : modelConfig.mode === "inherit" ? t("sessionSettings.status.inherit") : t("sessionSettings.status.default"))), e$2("button", {
				type: "button",
				className: `dsh-view-sidebar-item ${activeNav === "mcp" ? "active" : ""}`,
				onClick: () => setActiveNav("mcp")
			}, e$2("div", { className: "dsh-view-item-icon" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, { size: 16 })), e$2("span", { className: "dsh-view-item-title" }, t("sessionSettings.nav.mcpTitle")), e$2("span", { className: `dsh-view-item-badge ${effectiveActiveMcpCount > 0 ? "highlight" : ""}` }, effectiveActiveMcpCount > 0 ? `${effectiveActiveMcpCount} MCP` : t("sessionSettings.status.none"))), e$2("button", {
				type: "button",
				className: `dsh-view-sidebar-item ${activeNav === "skills" ? "active" : ""}`,
				onClick: () => setActiveNav("skills")
			}, e$2("div", { className: "dsh-view-item-icon" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 16 })), e$2("span", { className: "dsh-view-item-title" }, t("sessionSettings.nav.skillsTitle")), e$2("span", { className: `dsh-view-item-badge ${effectiveActiveSkillsCount > 0 ? "highlight" : ""}` }, availableSkills.length > 0 ? `${effectiveActiveSkillsCount}/${availableSkills.length}` : t("sessionSettings.status.none")))), e$2("div", { className: "dsh-session-view-content" }, activeNav === "model" ? e$2("div", { className: "dsh-view-content-inner" }, e$2("div", { className: "dsh-section-header" }, e$2("h3", { className: "dsh-section-title" }, t("sessionSettings.section.modelTitle")), e$2("p", { className: "dsh-section-desc" }, t("sessionSettings.section.modelDesc"))), e$2("div", { className: "dsh-sam-mode-list" }, sessionId ? e$2("label", { className: `dsh-sam-mode-item ${modelConfig.mode === "default" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "subagentModelMode",
				checked: modelConfig.mode === "default",
				onChange: () => handleModelModeChange("default")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.mode.default.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.mode.default.desc")))) : null, e$2("label", { className: `dsh-sam-mode-item ${modelConfig.mode === "inherit" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "subagentModelMode",
				checked: modelConfig.mode === "inherit",
				onChange: () => handleModelModeChange("inherit")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.mode.inherit.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.mode.inherit.desc")))), e$2("label", { className: `dsh-sam-mode-item ${modelConfig.mode === "custom" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "subagentModelMode",
				checked: modelConfig.mode === "custom",
				onChange: () => handleModelModeChange("custom")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.mode.custom.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.mode.custom.desc"))))), modelConfig.mode === "custom" ? e$2("div", { className: "dsh-sam-fields-panel" }, e$2("div", { className: "dsh-sam-field-group" }, e$2("label", { className: "dsh-sam-field-label" }, t("sessionSettings.field.provider")), e$2("select", {
				className: "dsh-sam-select",
				value: modelConfig.provider || "",
				onChange: (evt) => handleProviderChange(evt.target.value)
			}, !modelConfig.provider ? e$2("option", {
				value: "",
				disabled: true
			}, t("sessionSettings.field.providerPlaceholder")) : null, providers.map((p) => e$2("option", {
				key: p.id,
				value: p.id
			}, p.name && p.name !== p.id ? `${p.name} (${p.id})` : p.name || p.id)))), e$2("div", { className: "dsh-sam-field-group" }, e$2("label", { className: "dsh-sam-field-label" }, t("sessionSettings.field.model")), e$2("select", {
				className: "dsh-sam-select",
				value: modelConfig.model || "",
				disabled: !modelConfig.provider || !currentProviderGroup?.models?.length,
				onChange: (evt) => handleModelSelectChange(evt.target.value)
			}, !modelConfig.model ? e$2("option", {
				value: "",
				disabled: true
			}, t("sessionSettings.field.modelPlaceholder")) : null, (currentProviderGroup?.models || []).map((m) => e$2("option", {
				key: m.id,
				value: m.id
			}, m.name || m.id)))), availableEfforts.length > 0 ? e$2("div", { className: "dsh-sam-field-group" }, e$2("label", { className: "dsh-sam-field-label" }, t("sessionSettings.field.reasoningEffort")), e$2("select", {
				className: "dsh-sam-select",
				value: modelConfig.reasoningEffort || "",
				onChange: (evt) => handleReasoningEffortChange(evt.target.value)
			}, e$2("option", { value: "" }, t("sessionSettings.field.reasoningEffortDefault")), availableEfforts.map((eff) => e$2("option", {
				key: eff.id,
				value: eff.id
			}, effortLabel(t, eff.id))))) : null) : null) : null, activeNav === "mcp" ? e$2("div", { className: "dsh-view-content-inner" }, e$2("div", { className: "dsh-section-header" }, e$2("h3", { className: "dsh-section-title" }, t("sessionSettings.section.mcpTitle")), e$2("p", { className: "dsh-section-desc" }, t("sessionSettings.section.mcpDesc"))), sessionId ? e$2("div", { className: "dsh-sam-mode-list" }, e$2("label", { className: `dsh-sam-mode-item ${mcpConfig.mode === "default" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "sessionMcpMode",
				checked: mcpConfig.mode === "default",
				onChange: () => handleMcpModeChange("default")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.mcpMode.default.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.mcpMode.default.desc")))), e$2("label", { className: `dsh-sam-mode-item ${mcpConfig.mode === "custom" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "sessionMcpMode",
				checked: mcpConfig.mode === "custom",
				onChange: () => handleMcpModeChange("custom")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.mcpMode.custom.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.mcpMode.custom.desc"))))) : null, availableMcpServers.length === 0 ? e$2("div", { className: "dsh-mcp-empty-card" }, e$2("p", { className: "dsh-mcp-empty-text" }, t("sessionSettings.mcp.empty"))) : e$2("div", { className: "dsh-session-mcp-box" }, mcpConfig.mode === "custom" || !sessionId ? e$2("div", { className: "dsh-mcp-quick-bar" }, e$2("button", {
				type: "button",
				className: `dsh-mcp-select-btn ${isAllMcpSelected ? "active" : ""}`,
				onClick: handleToggleSelectAllMcp
			}, isAllMcpSelected ? t("sessionSettings.mcp.deselectAll") : t("sessionSettings.mcp.selectAll"))) : null, e$2("div", { className: "dsh-session-mcp-list" }, availableMcpServers.map((server) => {
				const isChecked = mcpConfig.mode === "custom" || !sessionId ? (mcpConfig.enabledServerIds || []).includes(server.id) : Boolean(server.enabledByDefault);
				const isReadonly = sessionId && mcpConfig.mode === "default";
				const protoLabel = server.transport === "stdio" ? "STDIO" : server.detectedTransport === "sse" ? "SSE" : server.detectedTransport === "streamable-http" ? "Streamable HTTP" : "HTTP / SSE";
				const protoClass = server.transport === "stdio" ? "stdio" : server.detectedTransport === "sse" ? "sse" : server.detectedTransport === "streamable-http" ? "streamable-http" : "streamable-http-or-sse";
				return e$2("div", {
					key: server.id,
					role: "button",
					tabIndex: isReadonly ? void 0 : 0,
					className: `dsh-session-mcp-item ${isChecked ? "active" : ""} ${isReadonly ? "readonly" : ""}`,
					onClick: isReadonly ? void 0 : () => handleToggleMcpServer(server.id),
					onKeyDown: isReadonly ? void 0 : (evt) => {
						if (evt.key === " " || evt.key === "Enter") {
							evt.preventDefault();
							handleToggleMcpServer(server.id);
						}
					}
				}, e$2("div", { className: "dsh-session-mcp-info" }, e$2("div", { className: "dsh-session-mcp-row1" }, e$2("div", { className: "dsh-session-mcp-title-wrap" }, server.transport === "stdio" ? e$2(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, { size: 14 }) : e$2(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }), e$2("span", { className: "dsh-session-mcp-name" }, server.name), e$2("span", { className: `dsh-mcp-proto-badge ${protoClass}` }, protoLabel), server.compatibility?.status === "incompatible-2026-07-28" || server.compatibility?.canEnable === false ? e$2("span", {
					className: "dsh-mcp-proto-badge incompatible",
					title: server.compatibility.warning || t("compatibility.incompatibleDesc")
				}, t("compatibility.incompatibleBadge")) : server.compatibility?.status === "downgrade-supported" ? e$2("span", {
					className: "dsh-mcp-proto-badge downgrade",
					title: server.compatibility.warning || t("compatibility.downgradedDesc")
				}, t("compatibility.downgradedBadge", { version: server.compatibility.negotiatedVersion || "2025-11-25" })) : null)), server.description ? e$2("p", { className: "dsh-session-mcp-desc" }, server.description) : null, e$2("code", { className: "dsh-session-mcp-target" }, server.transport === "stdio" ? `${server.command || ""} ${(server.args || []).join(" ")}` : server.url || ""), isChecked ? (() => {
					const isCustomTools = mcpConfig.toolsMode?.[server.id] === "custom";
					const customDisabledCount = (mcpConfig.disabledTools?.[server.id] || []).length;
					return e$2("div", { className: "dsh-session-mcp-tools-row" }, isCustomTools ? e$2("span", { className: `dsh-session-tools-mode-badge ${customDisabledCount > 0 ? "custom" : "all-active"}` }, customDisabledCount > 0 ? t("sessionSettings.mcp.toolsModeCustomBadge", { count: customDisabledCount }) : t("sessionSettings.mcp.toolsAllActiveBadge")) : e$2("span", { className: "dsh-session-tools-mode-badge default" }, t("sessionSettings.mcp.toolsModeDefaultBadge")), e$2("button", {
						type: "button",
						className: "dsh-session-tools-btn",
						onClick: (evt) => {
							evt.stopPropagation();
							handleOpenSessionToolsModal(server);
						}
					}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutline14, { size: 12 }), t("sessionSettings.mcp.toolsBtn")));
				})() : null), isChecked ? e$2("div", { className: "dsh-session-mcp-check" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { size: 16 })) : null);
			})))) : null, activeNav === "skills" ? e$2("div", { className: "dsh-view-content-inner" }, e$2("div", { className: "dsh-section-header" }, e$2("h3", { className: "dsh-section-title" }, t("sessionSettings.section.skillsTitle")), e$2("p", { className: "dsh-section-desc" }, t("sessionSettings.section.skillsDesc"))), sessionId ? e$2("div", { className: "dsh-sam-mode-list" }, e$2("label", { className: `dsh-sam-mode-item ${skillsConfig.mode === "default" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "sessionSkillsMode",
				checked: skillsConfig.mode === "default",
				onChange: () => handleSkillsModeChange("default")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.skillsMode.default.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.skillsMode.default.desc")))), e$2("label", { className: `dsh-sam-mode-item ${skillsConfig.mode === "custom" ? "selected" : ""}` }, e$2("input", {
				type: "radio",
				name: "sessionSkillsMode",
				checked: skillsConfig.mode === "custom",
				onChange: () => handleSkillsModeChange("custom")
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.skillsMode.custom.title")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.skillsMode.custom.desc"))))) : null, availableSkills.length === 0 ? e$2("div", { className: "dsh-mcp-empty-card" }, e$2("p", { className: "dsh-mcp-empty-text" }, t("sessionSettings.skills.empty"))) : e$2("div", { className: "dsh-session-skills-box" }, e$2("div", { className: "dsh-skills-toolbar" }, e$2("div", { className: "dsh-skills-search-wrap" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {
				size: 14,
				className: "dsh-skills-search-icon"
			}), e$2("input", {
				type: "text",
				className: "dsh-skills-search-input",
				placeholder: t("sessionSettings.skills.searchPlaceholder"),
				value: skillsSearch,
				onChange: (evt) => setSkillsSearch(evt.target.value)
			})), e$2("div", { className: "dsh-skills-btn-group" }, e$2("button", {
				type: "button",
				className: "dsh-mcp-text-btn",
				disabled: refreshingSkills,
				onClick: handleRefreshSkills
			}, refreshingSkills ? e$2(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
				size: 12,
				className: "dsh-spin"
			}) : e$2(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 12 }), t("sessionSettings.skills.refresh")))), (() => {
				const filteredSkills = availableSkills.filter((s) => {
					if (!skillsSearch.trim()) return true;
					const q = skillsSearch.trim().toLowerCase();
					return s.name.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q);
				});
				if (filteredSkills.length === 0) return e$2("div", { className: "dsh-mcp-empty-card" }, e$2("p", { className: "dsh-mcp-empty-text" }, t("sessionSettings.skills.noMatch")));
				return e$2("div", { className: "dsh-session-skills-list" }, filteredSkills.map((skill) => {
					const isModelDisabled = effectiveDisabledModelSet.has(skill.name);
					const isUserDisabled = effectiveDisabledUserSet.has(skill.name);
					const isRuntime = Boolean(skill.isRuntime);
					const { sourceClass, sourceLabel } = getSkillSourceMeta(skill, t);
					return e$2("div", {
						key: skill.name,
						className: `dsh-session-skill-item ${!isModelDisabled ? "active" : "disabled"}`,
						onClick: () => handleOpenSessionSkillModal(skill),
						style: { cursor: "pointer" }
					}, e$2("div", { className: "dsh-session-skill-main" }, e$2("div", { className: "dsh-session-skill-info" }, e$2("div", { className: "dsh-session-skill-row1" }, e$2("div", { className: "dsh-session-skill-title-wrap" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 14 }), e$2("span", { className: "dsh-session-skill-name" }, skill.name), e$2("span", { className: `dsh-skill-badge ${sourceClass}` }, sourceLabel), isRuntime ? null : e$2("span", { className: `dsh-skill-badge ${!isModelDisabled ? "status-enabled" : "status-disabled"}` }, !isModelDisabled ? t("sessionSettings.skills.modelInvocableEnabled") || "模型调用: 开启" : t("sessionSettings.skills.modelInvocableDisabled") || "模型调用: 禁用"), isRuntime ? null : e$2("span", { className: `dsh-skill-badge ${!isUserDisabled ? "status-enabled" : "status-disabled"}` }, !isUserDisabled ? t("sessionSettings.skills.userInvocableEnabled") || "快捷指令: 开启" : t("sessionSettings.skills.userInvocableDisabled") || "快捷指令: 禁用"))), skill.description ? e$2("p", { className: "dsh-session-skill-desc" }, skill.description) : null), e$2("div", { className: "dsh-skill-actions" }, e$2("button", {
						type: "button",
						className: "dsh-skill-config-btn",
						onClick: (evt) => {
							evt.stopPropagation();
							handleOpenSessionSkillModal(skill);
						}
					}, t("sessionSettings.skills.openModalBtn") || "配置 / 详情"))));
				}));
			})())) : null)), sessionSkillModalTarget ? (() => {
				const modalSkill = sessionSkillModalTarget;
				const modalDetail = skillsContentMap[modalSkill.name] || modalSkill;
				const modalIsRuntime = Boolean(modalSkill.isRuntime);
				const modalIsModelDisabled = effectiveDisabledModelSet.has(modalSkill.name);
				const modalIsUserDisabled = effectiveDisabledUserSet.has(modalSkill.name);
				const modalIsLoadingContent = Boolean(skillsLoadingMap[modalSkill.name]);
				const { sourceClass: modalSourceClass, sourceLabel: modalSourceLabel } = getSkillSourceMeta(modalSkill, t);
				const handleModalToggleModel = () => {
					if (skillsConfig.mode !== "custom") handleSkillsModeChange("custom");
					handleToggleModelInvocable(modalSkill.name);
				};
				const handleModalToggleUser = () => {
					if (skillsConfig.mode !== "custom") handleSkillsModeChange("custom");
					handleToggleUserInvocable(modalSkill.name);
				};
				return e$2("div", {
					className: "dsh-sam-modal-overlay",
					onClick: (evt) => {
						if (evt.target === evt.currentTarget) setSessionSkillModalTarget(null);
					}
				}, e$2("div", { className: "dsh-sam-modal-panel dsh-skill-modal" }, e$2("div", { className: "dsh-sam-header-row" }, e$2("div", { className: "dsh-mcp-tools-header-info" }, e$2("h3", {
					className: "dsh-sam-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "8px"
					}
				}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16, { size: 18 }), modalSkill.name), e$2("div", { className: "dsh-skill-modal-header-meta" }, e$2("span", { className: `dsh-skill-badge ${modalSourceClass}` }, modalSourceLabel), !modalIsRuntime ? e$2("span", { className: `dsh-skill-badge ${!modalIsModelDisabled ? "status-enabled" : "status-disabled"}` }, !modalIsModelDisabled ? t("sessionSettings.skills.modelInvocableEnabled") || "模型调用: 开启" : t("sessionSettings.skills.modelInvocableDisabled") || "模型调用: 禁用") : null, !modalIsRuntime ? e$2("span", { className: `dsh-skill-badge ${!modalIsUserDisabled ? "status-enabled" : "status-disabled"}` }, !modalIsUserDisabled ? t("sessionSettings.skills.userInvocableEnabled") || "快捷指令: 开启" : t("sessionSettings.skills.userInvocableDisabled") || "快捷指令: 禁用") : null)), e$2("button", {
					type: "button",
					className: "dsh-sam-close-btn",
					onClick: () => setSessionSkillModalTarget(null)
				}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$2("div", { className: "dsh-skill-modal-body" }, modalSkill.description ? e$2("p", { className: "dsh-skill-modal-desc" }, modalSkill.description) : null, modalIsRuntime ? e$2("div", { className: "dsh-skill-runtime-note" }, t("sessionSettings.skills.runtimeNotice")) : null, modalDetail.path ? e$2("div", { className: "dsh-skill-detail-meta" }, e$2("span", null, t("sessionSettings.skills.pathLabel"), e$2("code", { className: "dsh-skill-detail-path" }, modalDetail.path))) : null, modalDetail.whenToUse ? e$2("div", { className: "dsh-skill-detail-meta" }, e$2("span", null, t("sessionSettings.skills.whenToUseLabel"), modalDetail.whenToUse)) : null, e$2("div", { className: "dsh-skill-modal-section" }, e$2("h4", { className: "dsh-skill-modal-section-title" }, t("sessionSettings.skills.rulesSectionTitle") || "调用权限管控"), e$2("div", { style: {
					display: "flex",
					flexDirection: "column",
					gap: "8px"
				} }, e$2("div", {
					className: `dsh-mcp-switch-card mini ${!modalIsModelDisabled ? "active" : ""}`,
					onClick: handleModalToggleModel,
					style: { cursor: "pointer" }
				}, e$2("div", { className: "dsh-mcp-switch-text" }, e$2("span", { className: "dsh-mcp-switch-title" }, t("sessionSettings.skills.modelInvocableTitle")), e$2("span", { className: "dsh-mcp-switch-desc" }, t("sessionSettings.skills.modelInvocableDesc"))), e$2("div", { className: `dsh-mcp-switch-btn ${!modalIsModelDisabled ? "active" : ""}` }, e$2("span", { className: "dsh-mcp-switch-thumb" }))), e$2("div", {
					className: `dsh-mcp-switch-card mini ${!modalIsUserDisabled ? "active" : ""}`,
					onClick: handleModalToggleUser,
					style: { cursor: "pointer" }
				}, e$2("div", { className: "dsh-mcp-switch-text" }, e$2("span", { className: "dsh-mcp-switch-title" }, t("sessionSettings.skills.userInvocableTitle")), e$2("span", { className: "dsh-mcp-switch-desc" }, t("sessionSettings.skills.userInvocableDesc"))), e$2("div", { className: `dsh-mcp-switch-btn ${!modalIsUserDisabled ? "active" : ""}` }, e$2("span", { className: "dsh-mcp-switch-thumb" }))))), e$2("div", { className: "dsh-skill-modal-section" }, e$2("h4", { className: "dsh-skill-modal-section-title" }, t("sessionSettings.skills.instructionsSectionTitle") || "指令与规则"), modalIsLoadingContent ? e$2("div", { className: "dsh-sam-notice info" }, t("sessionSettings.skills.loadingContent")) : e$2("pre", { className: "dsh-skill-content-block" }, modalDetail.content || t("sessionSettings.skills.noInstructions")))), e$2("div", { className: "dsh-sam-actions dsh-mcp-modal-footer" }, e$2("div", { className: "dsh-mcp-modal-footer-left" }), e$2("div", { className: "dsh-mcp-modal-footer-right" }, e$2("button", {
					type: "button",
					className: "dsh-sam-btn primary",
					onClick: () => setSessionSkillModalTarget(null)
				}, t("sessionSettings.skills.modalDoneBtn") || "完成")))));
			})() : null, sessionToolsModalServer ? e$2("div", {
				className: "dsh-sam-modal-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setSessionToolsModalServer(null);
				}
			}, e$2("div", { className: "dsh-sam-modal-panel dsh-mcp-tools-modal" }, e$2("div", { className: "dsh-sam-header-row" }, e$2("div", { className: "dsh-mcp-tools-header-info" }, e$2("h3", { className: "dsh-sam-title" }, `${sessionToolsModalServer.name} - ${t("sessionSettings.toolsModal.title")}`), e$2("div", { className: "dsh-mcp-tools-header-meta" }, e$2("span", { className: `dsh-mcp-proto-badge ${sessionToolsModalServer.transport}` }, sessionToolsModalServer.transport === "stdio" ? "STDIO" : sessionToolsModalServer.detectedTransport === "sse" ? "SSE" : sessionToolsModalServer.detectedTransport === "streamable-http" ? "Streamable HTTP" : "HTTP / SSE"), sessionToolsList.length > 0 ? e$2("span", { className: "dsh-mcp-count-badge" }, `${sessionToolsList.length} 工具`) : null)), e$2("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setSessionToolsModalServer(null)
			}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$2("p", {
				className: "dsh-sam-desc",
				style: { marginBottom: 12 }
			}, t("sessionSettings.toolsModal.desc")), e$2("div", { className: "dsh-session-tools-modes" }, e$2("label", {
				className: `dsh-sam-mode-item ${sessionToolsMode === "default" ? "selected" : ""}`,
				onClick: () => {
					setSessionToolsMode("default");
					setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
				}
			}, e$2("input", {
				type: "radio",
				name: "sessionToolsMode",
				value: "default",
				checked: sessionToolsMode === "default",
				onChange: () => {
					setSessionToolsMode("default");
					setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
				},
				className: "dsh-sam-radio"
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.toolsModal.modeDefaultTitle")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.toolsModal.modeDefaultDesc", { count: (sessionToolsModalServer.disabledTools || []).length })))), e$2("label", {
				className: `dsh-sam-mode-item ${sessionToolsMode === "custom" ? "selected" : ""}`,
				onClick: () => setSessionToolsMode("custom")
			}, e$2("input", {
				type: "radio",
				name: "sessionToolsMode",
				value: "custom",
				checked: sessionToolsMode === "custom",
				onChange: () => setSessionToolsMode("custom"),
				className: "dsh-sam-radio"
			}), e$2("div", { className: "dsh-sam-mode-text" }, e$2("div", { className: "dsh-sam-mode-title" }, t("sessionSettings.toolsModal.modeCustomTitle")), e$2("div", { className: "dsh-sam-mode-desc" }, t("sessionSettings.toolsModal.modeCustomDesc"))))), e$2("div", { className: "dsh-mcp-tools-toolbar" }, e$2("div", { className: "dsh-mcp-search-wrap dsh-mcp-tools-search-box" }, e$2(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {
				size: 14,
				className: "dsh-mcp-search-icon"
			}), e$2("input", {
				type: "text",
				className: "dsh-sam-input dsh-mcp-search-input",
				placeholder: t("sessionSettings.toolsModal.searchPlaceholder"),
				value: sessionToolsSearch,
				onChange: (evt) => setSessionToolsSearch(evt.target.value)
			})), sessionToolsMode === "custom" ? e$2("div", { className: "dsh-mcp-tools-toolbar-actions" }, e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => handleToggleAllSessionTools(true)
			}, t("sessionSettings.toolsModal.enableAll")), e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => handleToggleAllSessionTools(false)
			}, t("sessionSettings.toolsModal.disableAll")), e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: handleResetSessionToolsToDefault
			}, t("sessionSettings.toolsModal.resetToDefault"))) : null), sessionToolsFetching ? e$2("div", {
				className: "dsh-sam-loading",
				style: { padding: 24 }
			}, t("sessionSettings.toolsModal.fetchingTools")) : sessionToolsList.length === 0 ? e$2("div", {
				className: "dsh-mcp-empty-card",
				style: { padding: "24px 16px" }
			}, e$2("p", { className: "dsh-mcp-empty-text" }, t("sessionSettings.toolsModal.noToolsAvailable")), e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: handleFetchSessionTools
			}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 14 }), t("sessionSettings.toolsModal.fetchToolsBtn"))) : e$2("div", { className: "dsh-mcp-tools-list" }, sessionToolsList.filter((tool) => {
				const term = sessionToolsSearch.trim().toLowerCase();
				if (!term) return true;
				return tool.name.toLowerCase().includes(term) || (tool.description || "").toLowerCase().includes(term);
			}).map((tool) => {
				const isGloballyDisabled = Boolean(sessionToolsModalServer.disabledTools?.includes(tool.name));
				const isCustomDisabled = sessionDisabledToolsSet.has(tool.name);
				const isDisabled = sessionToolsMode === "custom" ? isCustomDisabled : isGloballyDisabled;
				const isSchemaExpanded = sessionToolsExpandedSchemas.has(tool.name);
				const hasSchema = Boolean(tool.inputSchema && typeof tool.inputSchema === "object" && tool.inputSchema.properties && Object.keys(tool.inputSchema.properties).length > 0);
				return e$2("div", {
					key: tool.name,
					className: `dsh-mcp-tool-card ${isDisabled ? "disabled" : ""}`
				}, e$2("div", { className: "dsh-mcp-tool-card-main" }, e$2("div", { className: "dsh-mcp-tool-card-left" }, sessionToolsMode === "custom" ? e$2("button", {
					type: "button",
					role: "switch",
					"aria-checked": !isDisabled,
					className: `dsh-mcp-switch-btn ${!isDisabled ? "active" : ""}`,
					onClick: () => handleToggleSessionTool(tool.name)
				}, e$2("span", { className: "dsh-mcp-switch-thumb" })) : e$2("div", {
					className: `dsh-mcp-switch-btn ${!isDisabled ? "active" : ""}`,
					style: {
						opacity: .6,
						cursor: "default"
					}
				}, e$2("span", { className: "dsh-mcp-switch-thumb" })), e$2("div", { className: "dsh-mcp-tool-info" }, e$2("div", { className: "dsh-mcp-tool-title-row" }, e$2("span", { className: "dsh-mcp-tool-name" }, tool.name), sessionToolsMode === "custom" ? isCustomDisabled ? e$2("span", { className: "dsh-mcp-tool-status-pill disabled" }, t("sessionSettings.toolsModal.toolCustomDisabledBadge")) : e$2("span", { className: "dsh-mcp-tool-status-pill active" }, t("sessionSettings.toolsModal.toolEnabled")) : isGloballyDisabled ? e$2("span", { className: "dsh-mcp-tool-status-pill disabled" }, t("sessionSettings.toolsModal.toolGlobalDisabledBadge")) : e$2("span", { className: "dsh-mcp-tool-status-pill active" }, t("sessionSettings.toolsModal.toolEnabled"))), e$2("p", { className: "dsh-mcp-tool-desc" }, tool.description || t("sessionSettings.toolsModal.noDesc")))), e$2("div", { className: "dsh-mcp-tool-card-right" }, hasSchema ? e$2("button", {
					type: "button",
					className: `dsh-mcp-tool-schema-btn ${isSchemaExpanded ? "active" : ""}`,
					onClick: () => handleToggleSessionSchema(tool.name)
				}, e$2(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, { size: 12 }), isSchemaExpanded ? t("sessionSettings.toolsModal.hideParameters") : t("sessionSettings.toolsModal.parameters")) : null)), isSchemaExpanded && hasSchema ? (() => {
					const params = parseToolParameters$1(tool.inputSchema);
					const mode = sessionToolSchemaModes[tool.name] || "list";
					const requiredCount = params.filter((p) => p.required).length;
					return e$2("div", { className: "dsh-mcp-tool-expanded-box" }, e$2("div", { className: "dsh-mcp-tool-expanded-header" }, e$2("span", { className: "dsh-mcp-tool-param-stats" }, params.length > 0 ? t("sessionSettings.toolsModal.paramsCount", {
						total: params.length,
						required: requiredCount
					}) : t("sessionSettings.toolsModal.noParams")), e$2("div", { className: "dsh-mcp-tool-view-switch" }, e$2("button", {
						type: "button",
						className: `dsh-mcp-seg-btn ${mode === "list" ? "active" : ""}`,
						onClick: (evt) => {
							evt.stopPropagation();
							setSessionToolSchemaModes((prev) => ({
								...prev,
								[tool.name]: "list"
							}));
						}
					}, t("sessionSettings.toolsModal.viewList")), e$2("button", {
						type: "button",
						className: `dsh-mcp-seg-btn ${mode === "raw" ? "active" : ""}`,
						onClick: (evt) => {
							evt.stopPropagation();
							setSessionToolSchemaModes((prev) => ({
								...prev,
								[tool.name]: "raw"
							}));
						}
					}, t("sessionSettings.toolsModal.viewRaw")))), mode === "list" ? params.length > 0 ? e$2("div", { className: "dsh-mcp-tool-params-list" }, params.map((param) => e$2("div", {
						key: param.name,
						className: "dsh-mcp-param-row"
					}, e$2("div", { className: "dsh-mcp-param-top" }, e$2("span", { className: "dsh-mcp-param-name" }, param.name), e$2("span", { className: "dsh-mcp-param-type" }, param.type), e$2("span", { className: `dsh-mcp-param-badge ${param.required ? "required" : "optional"}` }, param.required ? t("sessionSettings.toolsModal.required") : t("sessionSettings.toolsModal.optional")), param.default !== void 0 ? e$2("span", { className: "dsh-mcp-param-default" }, `${t("sessionSettings.toolsModal.defaultVal")}${JSON.stringify(param.default)}`) : null), param.description ? e$2("p", { className: "dsh-mcp-param-desc" }, param.description) : null))) : null : e$2("pre", { className: "dsh-mcp-tool-schema-preview" }, JSON.stringify(tool.inputSchema, null, 2)));
				})() : null);
			})), e$2("div", {
				className: "dsh-sam-actions dsh-mcp-modal-footer",
				style: { marginTop: 14 }
			}, e$2("div", { className: "dsh-mcp-modal-footer-left" }, sessionToolsMode === "custom" ? sessionDisabledToolsSet.size > 0 ? e$2("span", { className: "dsh-mcp-proto-badge disabled-tools" }, t("sessionSettings.toolsModal.disabledCount", { count: sessionDisabledToolsSet.size })) : e$2("span", { className: "dsh-mcp-proto-badge stdio" }, t("sessionSettings.toolsModal.allEnabledCount", { total: sessionToolsList.length })) : e$2("span", { className: "dsh-mcp-proto-badge stdio" }, t("sessionSettings.toolsModal.modeDefaultTitle"))), e$2("div", { className: "dsh-mcp-modal-footer-right" }, e$2("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => setSessionToolsModalServer(null)
			}, t("sessionSettings.toolsModal.cancel")), e$2("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				onClick: handleApplySessionTools
			}, t("sessionSettings.toolsModal.save")))))) : null, e$2("div", { className: "dsh-session-view-footer" }, e$2("div", { className: "dsh-view-footer-left" }, sessionId && hasSessionOverride ? e$2("button", {
				type: "button",
				className: "dsh-sam-btn tertiary",
				disabled: saving || savingDefault,
				onClick: handleResetSession
			}, t("sessionSettings.action.reset")) : null), e$2("div", { className: "dsh-view-footer-right" }, sessionId ? e$2("button", {
				type: "button",
				className: "dsh-sam-btn default-btn",
				disabled: saving || savingDefault,
				onClick: () => handleSave(true)
			}, savingDefault ? t("sessionSettings.action.savingDefault") : t("sessionSettings.action.saveDefault")) : null, e$2("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				disabled: saving || savingDefault,
				onClick: () => handleSave(false)
			}, saving ? t("sessionSettings.action.saving") : sessionId ? t("sessionSettings.action.saveSession") : t("sessionSettings.action.save")))));
		}
		//#endregion
		//#region src/client/McpServersSettingsTab.ts
		const e$1 = react.createElement;
		function parseToolParameters(schema) {
			if (!schema || typeof schema !== "object") return [];
			const properties = schema.properties;
			if (!properties || typeof properties !== "object") return [];
			const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);
			const items = [];
			for (const [name, rawProp] of Object.entries(properties)) {
				if (!rawProp || typeof rawProp !== "object") {
					items.push({
						name,
						type: "any",
						required: requiredSet.has(name)
					});
					continue;
				}
				const prop = rawProp;
				let typeStr = prop.type || "any";
				if (prop.type === "array") typeStr = `array<${prop.items?.type || "any"}>`;
				else if (Array.isArray(prop.type)) typeStr = prop.type.join(" | ");
				items.push({
					name,
					type: typeStr,
					required: requiredSet.has(name),
					description: typeof prop.description === "string" ? prop.description : void 0,
					default: prop.default,
					enum: Array.isArray(prop.enum) ? prop.enum : void 0
				});
			}
			items.sort((a, b) => {
				if (a.required !== b.required) return a.required ? -1 : 1;
				return a.name.localeCompare(b.name);
			});
			return items;
		}
		function McpServersSettingsTab({ api: _api, t, close: _close }) {
			const [servers, setServers] = react.useState([]);
			const [loading, setLoading] = react.useState(true);
			const [error, setError] = react.useState("");
			const [successMsg, setSuccessMsg] = react.useState("");
			const [formOpen, setFormOpen] = react.useState(false);
			const [isEditing, setIsEditing] = react.useState(false);
			const [formServer, setFormServer] = react.useState({
				transport: "stdio",
				enabledByDefault: false
			});
			const [envEntries, setEnvEntries] = react.useState([]);
			const [headerEntries, setHeaderEntries] = react.useState([]);
			const [formSaving, setFormSaving] = react.useState(false);
			const [formTesting, setFormTesting] = react.useState(false);
			const [formError, setFormError] = react.useState("");
			const [showAdvanced, setShowAdvanced] = react.useState(false);
			const [formTestResult, setFormTestResult] = react.useState(null);
			const [saveConfirm, setSaveConfirm] = react.useState(null);
			const [testingId, setTestingId] = react.useState(null);
			const [testResults, setTestResults] = react.useState({});
			const [importOpen, setImportOpen] = react.useState(false);
			const [importText, setImportText] = react.useState("");
			const [importing, setImporting] = react.useState(false);
			const [importError, setImportError] = react.useState("");
			const [toolsModalOpen, setToolsModalOpen] = react.useState(false);
			const [toolsTargetServer, setToolsTargetServer] = react.useState(null);
			const [toolsSource, setToolsSource] = react.useState("card");
			const [toolsLoading, setToolsLoading] = react.useState(false);
			const [toolsError, setToolsError] = react.useState("");
			const [toolsList, setToolsList] = react.useState([]);
			const [toolsDisabledSet, setToolsDisabledSet] = react.useState(/* @__PURE__ */ new Set());
			const [toolsSearch, setToolsSearch] = react.useState("");
			const [toolsExpandedSchemas, setToolsExpandedSchemas] = react.useState(/* @__PURE__ */ new Set());
			const [toolSchemaModes, setToolSchemaModes] = react.useState({});
			const [toolsServerInfo, setToolsServerInfo] = react.useState(null);
			const [toolsDetectedTransport, setToolsDetectedTransport] = react.useState(null);
			const [toolsSaving, setToolsSaving] = react.useState(false);
			const loadServers = react.useCallback(async () => {
				setLoading(true);
				setError("");
				try {
					const res = await fetch("/api/mcp-servers");
					if (res.ok) {
						const data = await res.json();
						if (data.ok && Array.isArray(data.servers)) {
							setServers(data.servers);
							saveLocalMcpServers(data.servers);
						}
					} else setError(`Failed to load MCP servers: ${res.statusText}`);
				} catch (err) {
					setError(err?.message || String(err));
				} finally {
					setLoading(false);
				}
			}, []);
			react.useEffect(() => {
				loadServers();
			}, [loadServers]);
			const handleOpenAdd = () => {
				setIsEditing(false);
				setShowAdvanced(false);
				setFormServer({
					id: "",
					name: "",
					description: "",
					transport: "stdio",
					command: "",
					args: [],
					cwd: "",
					url: "",
					enabledByDefault: false,
					toolCallTimeoutMs: void 0,
					failOnStartupError: false,
					reconnect: {
						enabled: true,
						initialDelayMs: void 0,
						maxDelayMs: void 0,
						maxAttempts: void 0
					},
					disabledTools: []
				});
				setEnvEntries([]);
				setHeaderEntries([]);
				setFormError("");
				setFormTestResult(null);
				setFormOpen(true);
			};
			const handleOpenEdit = (server) => {
				setIsEditing(true);
				setShowAdvanced(Boolean(server.toolCallTimeoutMs || server.failOnStartupError || server.reconnect && (server.reconnect.enabled === false || server.reconnect.initialDelayMs !== void 0 || server.reconnect.maxDelayMs !== void 0 || server.reconnect.maxAttempts !== void 0)));
				setFormServer({
					...server,
					reconnect: {
						enabled: server.reconnect?.enabled !== false,
						initialDelayMs: server.reconnect?.initialDelayMs,
						maxDelayMs: server.reconnect?.maxDelayMs,
						maxAttempts: server.reconnect?.maxAttempts
					},
					disabledTools: server.disabledTools ? [...server.disabledTools] : []
				});
				setEnvEntries(server.env ? Object.entries(server.env).map(([key, value]) => ({
					key,
					value
				})) : []);
				setHeaderEntries(server.headers ? Object.entries(server.headers).map(([key, value]) => ({
					key,
					value
				})) : []);
				setFormError("");
				setFormTestResult(null);
				setFormOpen(true);
			};
			const handleDelete = async (server) => {
				const confirmText = t("notices.deleteConfirm", { name: server.name || server.id });
				if (!window.confirm(confirmText)) return;
				try {
					const res = await fetch(`/api/mcp-servers?id=${encodeURIComponent(server.id)}`, { method: "DELETE" });
					if (res.ok) {
						const data = await res.json();
						if (data.ok) {
							setServers(data.servers || []);
							saveLocalMcpServers(data.servers || []);
							setSuccessMsg(t("notices.deleted"));
							setTimeout(() => setSuccessMsg(""), 3e3);
						}
					}
				} catch (err) {
					setError(t("notices.error") + (err?.message || String(err)));
				}
			};
			const handleTest = async (server) => {
				const id = server.id || "form_test";
				setTestingId(id);
				try {
					const data = await (await fetch("/api/mcp-servers?action=test", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "test",
							server
						})
					})).json();
					setTestResults((prev) => ({
						...prev,
						[id]: {
							ok: Boolean(data.ok),
							message: data.message || (data.ok ? "Connection OK" : "Failed")
						}
					}));
					if (data.servers) {
						setServers(data.servers);
						saveLocalMcpServers(data.servers);
					} else if (data.ok && server.id) setServers((prev) => {
						const next = prev.map((s) => s.id === server.id ? {
							...s,
							detectedTransport: data.detectedTransport || s.detectedTransport,
							serverInfo: data.serverInfo || s.serverInfo,
							compatibility: data.compatibility || s.compatibility,
							lastTestedAt: Date.now()
						} : s);
						saveLocalMcpServers(next);
						return next;
					});
				} catch (err) {
					setTestResults((prev) => ({
						...prev,
						[id]: {
							ok: false,
							message: err?.message || String(err)
						}
					}));
				} finally {
					setTestingId(null);
				}
			};
			const handleFormTest = async () => {
				setFormError("");
				setFormTestResult(null);
				if (formServer.transport === "stdio" && !formServer.command?.trim()) {
					setFormError(t("form.command") + " is required for stdio");
					return;
				}
				if (formServer.transport !== "stdio" && !formServer.url?.trim()) {
					setFormError(t("form.url") + " is required for HTTP/SSE");
					return;
				}
				const envMap = {};
				for (const item of envEntries) if (item.key.trim()) envMap[item.key.trim()] = item.value;
				const headerMap = {};
				for (const item of headerEntries) if (item.key.trim()) headerMap[item.key.trim()] = item.value;
				const serverObj = {
					id: formServer.id?.trim() || "modal_test",
					transport: formServer.transport,
					command: formServer.command?.trim(),
					args: formServer.args || [],
					cwd: formServer.cwd?.trim() || void 0,
					env: Object.keys(envMap).length > 0 ? envMap : void 0,
					url: formServer.url?.trim(),
					headers: Object.keys(headerMap).length > 0 ? headerMap : void 0,
					toolCallTimeoutMs: formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0 ? Number(formServer.toolCallTimeoutMs) : void 0,
					failOnStartupError: Boolean(formServer.failOnStartupError),
					reconnect: formServer.reconnect
				};
				setFormTesting(true);
				try {
					const data = await (await fetch("/api/mcp-servers?action=test", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "test",
							server: serverObj
						})
					})).json();
					setFormTestResult({
						ok: Boolean(data.ok),
						message: data.message || (data.ok ? "Connection OK" : "Failed")
					});
					if (data.ok) setFormServer((prev) => ({
						...prev,
						detectedTransport: data.detectedTransport || prev.detectedTransport,
						serverInfo: data.serverInfo || prev.serverInfo,
						compatibility: data.compatibility || prev.compatibility,
						lastTestedAt: Date.now()
					}));
				} catch (err) {
					setFormTestResult({
						ok: false,
						message: err?.message || String(err)
					});
				} finally {
					setFormTesting(false);
				}
			};
			const fetchToolsForServer = async (server) => {
				setToolsLoading(true);
				setToolsError("");
				try {
					const data = await (await fetch("/api/mcp-servers?action=tools", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "tools",
							server
						})
					})).json();
					if (data.ok) {
						if (data.serverInfo) setToolsServerInfo(data.serverInfo);
						if (data.detectedTransport) setToolsDetectedTransport(data.detectedTransport);
						if (data.servers) {
							setServers(data.servers);
							saveLocalMcpServers(data.servers);
						} else if (server.id) setServers((prev) => {
							const next = prev.map((s) => s.id === server.id ? {
								...s,
								detectedTransport: data.detectedTransport || s.detectedTransport,
								serverInfo: data.serverInfo || s.serverInfo,
								lastTestedAt: Date.now()
							} : s);
							saveLocalMcpServers(next);
							return next;
						});
						if (Array.isArray(data.toolDetails)) setToolsList(data.toolDetails);
						else if (Array.isArray(data.tools)) setToolsList(data.tools.map((t) => typeof t === "string" ? { name: t } : t));
					} else setToolsError(data.message || "Failed to fetch tools from MCP server");
				} catch (err) {
					setToolsError(err?.message || String(err));
				} finally {
					setToolsLoading(false);
				}
			};
			const handleOpenTools = (server, source = "card") => {
				setToolsTargetServer(server);
				setToolsSource(source);
				setToolsDisabledSet(new Set(server.disabledTools || []));
				setToolsSearch("");
				setToolsExpandedSchemas(/* @__PURE__ */ new Set());
				setToolsList([]);
				setToolsServerInfo(null);
				setToolsDetectedTransport(null);
				setToolsModalOpen(true);
				fetchToolsForServer(server);
			};
			const handleFormOpenTools = () => {
				if (formServer.transport === "stdio" && !formServer.command?.trim()) {
					setFormError(t("form.command") + " is required for stdio");
					return;
				}
				if (formServer.transport !== "stdio" && !formServer.url?.trim()) {
					setFormError(t("form.url") + " is required for HTTP/SSE");
					return;
				}
				const envMap = {};
				for (const item of envEntries) if (item.key.trim()) envMap[item.key.trim()] = item.value;
				const headerMap = {};
				for (const item of headerEntries) if (item.key.trim()) headerMap[item.key.trim()] = item.value;
				const serverObj = {
					id: formServer.id?.trim() || "modal_tools",
					name: formServer.name?.trim() || "MCP Server",
					description: formServer.description?.trim(),
					transport: formServer.transport,
					command: formServer.command?.trim(),
					args: formServer.args || [],
					cwd: formServer.cwd?.trim() || void 0,
					env: Object.keys(envMap).length > 0 ? envMap : void 0,
					url: formServer.url?.trim(),
					headers: Object.keys(headerMap).length > 0 ? headerMap : void 0,
					toolCallTimeoutMs: formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0 ? Number(formServer.toolCallTimeoutMs) : void 0,
					failOnStartupError: Boolean(formServer.failOnStartupError),
					reconnect: formServer.reconnect,
					disabledTools: formServer.disabledTools || []
				};
				handleOpenTools(serverObj, "form");
			};
			const handleToggleTool = (toolName) => {
				setToolsDisabledSet((prev) => {
					const next = new Set(prev);
					if (next.has(toolName)) next.delete(toolName);
					else next.add(toolName);
					return next;
				});
			};
			const handleToggleAllTools = (enableAll) => {
				if (enableAll) setToolsDisabledSet(/* @__PURE__ */ new Set());
				else setToolsDisabledSet(new Set(toolsList.map((t) => t.name)));
			};
			const handleToggleSchema = (toolName) => {
				setToolsExpandedSchemas((prev) => {
					const next = new Set(prev);
					if (next.has(toolName)) next.delete(toolName);
					else next.add(toolName);
					return next;
				});
			};
			const handleSaveToolsModal = async () => {
				const disabledArray = Array.from(toolsDisabledSet);
				if (toolsSource === "form") {
					setFormServer((prev) => ({
						...prev,
						disabledTools: disabledArray
					}));
					setToolsModalOpen(false);
					setSuccessMsg(t("toolsModal.saveSuccess"));
					setTimeout(() => setSuccessMsg(""), 3e3);
					return;
				}
				if (!toolsTargetServer?.id) {
					setToolsModalOpen(false);
					return;
				}
				setToolsSaving(true);
				try {
					const updatedServer = {
						...servers.find((s) => s.id === toolsTargetServer.id) || toolsTargetServer,
						disabledTools: disabledArray
					};
					const res = await fetch("/api/mcp-servers", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ server: updatedServer })
					});
					const data = await res.json();
					if (res.ok && data.ok) {
						setServers(data.servers || []);
						saveLocalMcpServers(data.servers || []);
						setToolsModalOpen(false);
						setSuccessMsg(t("toolsModal.saveSuccess"));
						setTimeout(() => setSuccessMsg(""), 3e3);
					} else setToolsError(data.error || "Failed to save tool settings");
				} catch (err) {
					setToolsError(err?.message || String(err));
				} finally {
					setToolsSaving(false);
				}
			};
			const filteredTools = react.useMemo(() => {
				const q = toolsSearch.trim().toLowerCase();
				if (!q) return toolsList;
				return toolsList.filter((t) => t.name.toLowerCase().includes(q) || t.description && t.description.toLowerCase().includes(q));
			}, [toolsList, toolsSearch]);
			const executeSave = async (payload) => {
				setFormSaving(true);
				setSaveConfirm(null);
				try {
					const res = await fetch("/api/mcp-servers", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ server: payload })
					});
					const data = await res.json();
					if (res.ok && data.ok) {
						setServers(data.servers || []);
						saveLocalMcpServers(data.servers || []);
						setFormOpen(false);
						setSuccessMsg(t("notices.saved"));
						setTimeout(() => setSuccessMsg(""), 3e3);
					} else setFormError(data.error || "Failed to save server");
				} catch (err) {
					setFormError(err?.message || String(err));
				} finally {
					setFormSaving(false);
				}
			};
			const handleSaveForm = async () => {
				setFormError("");
				if (!formServer.id?.trim()) {
					setFormError(t("form.id") + " is required");
					return;
				}
				if (!formServer.name?.trim()) {
					setFormError(t("form.name") + " is required");
					return;
				}
				if (formServer.transport === "stdio" && !formServer.command?.trim()) {
					setFormError(t("form.command") + " is required for stdio");
					return;
				}
				if (formServer.transport !== "stdio" && !formServer.url?.trim()) {
					setFormError(t("form.url") + " is required for HTTP/SSE");
					return;
				}
				const envMap = {};
				for (const item of envEntries) if (item.key.trim()) envMap[item.key.trim()] = item.value;
				const headerMap = {};
				for (const item of headerEntries) if (item.key.trim()) headerMap[item.key.trim()] = item.value;
				const payload = {
					id: formServer.id.trim(),
					name: formServer.name.trim(),
					description: formServer.description?.trim() || void 0,
					transport: formServer.transport,
					command: formServer.command?.trim() || void 0,
					args: formServer.args || [],
					cwd: formServer.cwd?.trim() || void 0,
					url: formServer.url?.trim() || void 0,
					env: Object.keys(envMap).length > 0 ? envMap : void 0,
					headers: Object.keys(headerMap).length > 0 ? headerMap : void 0,
					enabledByDefault: Boolean(formServer.enabledByDefault),
					toolCallTimeoutMs: formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0 ? Number(formServer.toolCallTimeoutMs) : void 0,
					failOnStartupError: Boolean(formServer.failOnStartupError),
					disabledTools: formServer.disabledTools && formServer.disabledTools.length > 0 ? formServer.disabledTools : void 0,
					detectedTransport: formServer.detectedTransport,
					serverInfo: formServer.serverInfo,
					lastTestedAt: formServer.lastTestedAt,
					reconnect: {
						enabled: formServer.reconnect?.enabled !== false,
						initialDelayMs: formServer.reconnect?.initialDelayMs !== void 0 && formServer.reconnect.initialDelayMs >= 0 ? Number(formServer.reconnect.initialDelayMs) : void 0,
						maxDelayMs: formServer.reconnect?.maxDelayMs !== void 0 && formServer.reconnect.maxDelayMs >= 0 ? Number(formServer.reconnect.maxDelayMs) : void 0,
						maxAttempts: formServer.reconnect?.maxAttempts !== void 0 && formServer.reconnect.maxAttempts >= 0 ? Number(formServer.reconnect.maxAttempts) : void 0
					}
				};
				setFormSaving(true);
				try {
					const testData = await (await fetch("/api/mcp-servers?action=test", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "test",
							server: payload
						})
					})).json();
					if (testData.ok) {
						payload.detectedTransport = testData.detectedTransport || payload.detectedTransport;
						payload.serverInfo = testData.serverInfo || payload.serverInfo;
						payload.lastTestedAt = Date.now();
						await executeSave(payload);
					} else {
						setFormSaving(false);
						setSaveConfirm({
							open: true,
							message: testData.message || "连接测试未通过",
							payload
						});
					}
				} catch (err) {
					setFormSaving(false);
					setSaveConfirm({
						open: true,
						message: err?.message || String(err),
						payload
					});
				}
			};
			const handleImportSubmit = async () => {
				setImportError("");
				if (!importText.trim()) return;
				try {
					const parsed = JSON.parse(importText.trim());
					const mcpDict = parsed.mcpServers || parsed;
					if (!mcpDict || typeof mcpDict !== "object") {
						setImportError(t("importModal.error"));
						return;
					}
					setImporting(true);
					let importedCount = 0;
					for (const [key, val] of Object.entries(mcpDict)) {
						if (!val || typeof val !== "object") continue;
						const item = val;
						const transport = item.transport === "stdio" || item.command && !item.url ? "stdio" : "streamable-http-or-sse";
						const serverObj = {
							id: key.replace(/[^a-zA-Z0-9_-]/g, "_"),
							name: item.name || key,
							description: item.description,
							transport,
							command: item.command,
							args: Array.isArray(item.args) ? item.args : [],
							env: item.env && typeof item.env === "object" ? item.env : void 0,
							cwd: item.cwd,
							url: item.url,
							headers: item.headers && typeof item.headers === "object" ? item.headers : void 0,
							enabledByDefault: Boolean(item.enabledByDefault),
							toolCallTimeoutMs: typeof item.toolCallTimeoutMs === "number" && item.toolCallTimeoutMs > 0 ? item.toolCallTimeoutMs : void 0,
							failOnStartupError: typeof item.failOnStartupError === "boolean" ? item.failOnStartupError : void 0,
							reconnect: item.reconnect && typeof item.reconnect === "object" ? item.reconnect : void 0
						};
						await fetch("/api/mcp-servers", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ server: serverObj })
						});
						importedCount++;
					}
					await loadServers();
					setImportOpen(false);
					setImportText("");
					setSuccessMsg(t("importModal.success", { count: importedCount }));
					setTimeout(() => setSuccessMsg(""), 3500);
				} catch (err) {
					setImportError(t("importModal.error") + ": " + (err?.message || String(err)));
				} finally {
					setImporting(false);
				}
			};
			return e$1("div", { className: "dsh-mcp-settings-page" }, e$1("div", { className: "dsh-mcp-header-card" }, e$1("div", { className: "dsh-mcp-header-title-row" }, e$1("div", null, e$1("h2", { className: "dsh-mcp-page-title" }, t("title")), e$1("p", { className: "dsh-mcp-page-desc" }, t("desc"))), e$1("div", { className: "dsh-mcp-header-actions" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: loadServers,
				title: t("actions.refresh")
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 14 })), e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => setImportOpen(true)
			}, t("actions.import")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				onClick: handleOpenAdd
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {
				size: 14,
				className: "dsh-btn-icon-left"
			}), t("actions.add"))))), successMsg ? e$1("div", { className: "dsh-sam-notice success" }, successMsg) : null, error ? e$1("div", { className: "dsh-sam-notice error" }, error) : null, loading ? e$1("div", { className: "dsh-sam-loading" }, "Loading MCP servers...") : servers.length === 0 ? e$1("div", { className: "dsh-mcp-empty-card" }, e$1("div", { className: "dsh-mcp-empty-icon" }, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, { size: 28 })), e$1("div", { className: "dsh-mcp-empty-text" }, t("table.empty")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				onClick: handleOpenAdd
			}, t("actions.add"))) : e$1("div", { className: "dsh-mcp-server-list" }, servers.map((server) => {
				const testResult = testResults[server.id];
				const isTesting = testingId === server.id;
				const protoLabel = server.transport === "stdio" ? "STDIO" : server.detectedTransport === "sse" ? "SSE" : server.detectedTransport === "streamable-http" ? "Streamable HTTP" : "HTTP / SSE";
				const protoClass = server.transport === "stdio" ? "stdio" : server.detectedTransport === "sse" ? "sse" : server.detectedTransport === "streamable-http" ? "streamable-http" : "streamable-http-or-sse";
				return e$1("div", {
					key: server.id,
					className: "dsh-mcp-server-card"
				}, e$1("div", { className: "dsh-mcp-card-top" }, e$1("div", { className: "dsh-mcp-card-identity" }, e$1("div", { className: "dsh-mcp-transport-icon" }, server.transport === "stdio" ? e$1(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, { size: 16 }) : e$1(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 16 })), e$1("div", { className: "dsh-mcp-title-wrap" }, e$1("span", { className: "dsh-mcp-card-name" }, server.name), e$1("span", { className: "dsh-mcp-card-id" }, server.id))), e$1("div", { className: "dsh-mcp-badges" }, e$1("span", { className: `dsh-mcp-proto-badge ${protoClass}` }, protoLabel), server.serverInfo?.version ? e$1("span", {
					className: "dsh-mcp-proto-badge server-version",
					title: server.serverInfo.protocolVersion ? `MCP Protocol: ${server.serverInfo.protocolVersion}` : server.serverInfo.name || void 0
				}, server.serverInfo.name && server.serverInfo.name !== server.id && server.serverInfo.name !== server.name ? `${server.serverInfo.name} ${server.serverInfo.version}` : server.serverInfo.version) : server.serverInfo?.protocolVersion ? e$1("span", {
					className: "dsh-mcp-proto-badge server-version",
					title: server.serverInfo.name || void 0
				}, `MCP ${server.serverInfo.protocolVersion}`) : null, server.toolCallTimeoutMs ? e$1("span", { className: "dsh-mcp-proto-badge timeout" }, `${server.toolCallTimeoutMs / 1e3}s 超时`) : null, server.disabledTools && server.disabledTools.length > 0 ? e$1("span", { className: "dsh-mcp-proto-badge disabled-tools" }, t("toolsModal.disabledBadge", { count: server.disabledTools.length })) : null, server.compatibility?.status === "incompatible-2026-07-28" || server.compatibility?.canEnable === false ? e$1("span", {
					className: "dsh-mcp-proto-badge incompatible",
					title: server.compatibility.warning || t("compatibility.incompatibleDesc")
				}, t("compatibility.incompatibleBadge")) : server.compatibility?.status === "downgrade-supported" ? e$1("span", {
					className: "dsh-mcp-proto-badge downgrade",
					title: server.compatibility.warning || t("compatibility.downgradedDesc")
				}, t("compatibility.downgradedBadge", { version: server.compatibility.negotiatedVersion || "2025-11-25" })) : null, server.enabledByDefault ? e$1("span", { className: "dsh-mcp-default-badge" }, t("table.enabledDefault")) : null)), server.description ? e$1("p", { className: "dsh-mcp-card-desc" }, server.description) : null, e$1("div", { className: "dsh-mcp-target-box" }, server.transport === "stdio" ? e$1("code", { className: "dsh-mcp-code-preview" }, `${server.command || ""} ${(server.args || []).join(" ")}`) : e$1("code", { className: "dsh-mcp-code-preview" }, server.url || "")), testResult ? e$1("div", { className: `dsh-mcp-inline-test ${testResult.ok ? "success" : "error"}` }, !testResult.ok ? e$1(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { size: 14 }) : null, e$1("span", null, testResult.message)) : null, e$1("div", { className: "dsh-mcp-card-footer" }, e$1("div", { style: {
					display: "flex",
					gap: "6px",
					alignItems: "center"
				} }, e$1("button", {
					type: "button",
					className: "dsh-mcp-mini-btn",
					disabled: isTesting,
					onClick: () => handleTest(server),
					title: t("actions.test")
				}, isTesting ? e$1(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
					size: 13,
					className: "dsh-spin"
				}) : e$1(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, { size: 13 }), isTesting ? t("actions.testing") : t("actions.test")), e$1("button", {
					type: "button",
					className: "dsh-mcp-mini-btn",
					onClick: () => handleOpenTools(server, "card"),
					title: t("actions.toolsList")
				}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutline14, { size: 13 }), t("actions.toolsList"), server.disabledTools && server.disabledTools.length > 0 ? e$1("span", { className: "dsh-mcp-mini-badge danger" }, String(server.disabledTools.length)) : null)), e$1("div", { className: "dsh-mcp-footer-right" }, e$1("button", {
					type: "button",
					className: "dsh-mcp-icon-btn",
					onClick: () => handleOpenEdit(server),
					title: t("actions.edit")
				}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, { size: 14 })), e$1("button", {
					type: "button",
					className: "dsh-mcp-icon-btn danger",
					onClick: () => handleDelete(server),
					title: t("actions.delete")
				}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { size: 14 })))));
			})), formOpen ? e$1("div", {
				className: "dsh-sam-modal-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setFormOpen(false);
				}
			}, e$1("div", { className: "dsh-sam-modal-panel dsh-mcp-form-modal" }, e$1("div", { className: "dsh-sam-header-row" }, e$1("h3", { className: "dsh-sam-title" }, isEditing ? t("form.editTitle") : t("form.addTitle")), e$1("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setFormOpen(false)
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), formError || formTestResult || formServer.compatibility?.canEnable === false || formServer.compatibility?.status === "incompatible-2026-07-28" || formServer.compatibility?.status === "downgrade-supported" ? e$1("div", { className: "dsh-sam-notices-block" }, formError ? e$1("div", { className: "dsh-sam-notice error" }, formError) : null, formTestResult ? e$1("div", { className: `dsh-sam-notice ${formTestResult.ok ? "success" : "error"}` }, formTestResult.message) : null, formServer.compatibility?.canEnable === false || formServer.compatibility?.status === "incompatible-2026-07-28" ? e$1("div", { className: "dsh-sam-notice error" }, `⚠️ ${t("compatibility.incompatibleBadge")}: ${formServer.compatibility?.warning || t("compatibility.incompatibleDesc")}`) : formServer.compatibility?.status === "downgrade-supported" ? e$1("div", { className: "dsh-sam-notice info" }, `ℹ️ ${t("compatibility.downgradedBadge", { version: formServer.compatibility.negotiatedVersion || "2025-11-25" })}: ${formServer.compatibility?.warning || t("compatibility.downgradedDesc")}`) : null) : null, e$1("div", { className: "dsh-mcp-form-body" }, e$1("div", {
				className: `dsh-mcp-switch-card ${formServer.enabledByDefault ? "active" : ""}`,
				role: "button",
				tabIndex: 0,
				onClick: () => setFormServer({
					...formServer,
					enabledByDefault: !formServer.enabledByDefault
				}),
				onKeyDown: (evt) => {
					if (evt.key === " " || evt.key === "Enter") {
						evt.preventDefault();
						setFormServer({
							...formServer,
							enabledByDefault: !formServer.enabledByDefault
						});
					}
				}
			}, e$1("div", { className: "dsh-mcp-switch-text" }, e$1("div", { className: "dsh-mcp-switch-title" }, t("form.enabledByDefault")), e$1("div", { className: "dsh-mcp-switch-desc" }, t("form.enabledByDefaultDesc"))), e$1("div", {
				className: `dsh-mcp-switch-btn ${formServer.enabledByDefault ? "active" : ""}`,
				"aria-hidden": "true"
			}, e$1("span", { className: "dsh-mcp-switch-thumb" }))), e$1("div", { className: "dsh-mcp-form-row" }, e$1("div", { className: "dsh-sam-field-group flex-1" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.id")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.idPlaceholder"),
				disabled: isEditing,
				value: formServer.id || "",
				onChange: (evt) => setFormServer({
					...formServer,
					id: evt.target.value
				})
			})), e$1("div", { className: "dsh-sam-field-group flex-1" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.name")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.namePlaceholder"),
				value: formServer.name || "",
				onChange: (evt) => setFormServer({
					...formServer,
					name: evt.target.value
				})
			}))), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.description")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.descriptionPlaceholder"),
				value: formServer.description || "",
				onChange: (evt) => setFormServer({
					...formServer,
					description: evt.target.value
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.transport")), e$1("select", {
				className: "dsh-sam-select",
				value: formServer.transport || "stdio",
				onChange: (evt) => setFormServer({
					...formServer,
					transport: evt.target.value
				})
			}, e$1("option", { value: "stdio" }, t("form.transportStdio")), e$1("option", { value: "streamable-http-or-sse" }, t("form.transportHttp")))), formServer.transport === "stdio" ? e$1(react.Fragment, null, e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.command")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.commandPlaceholder"),
				value: formServer.command || "",
				onChange: (evt) => setFormServer({
					...formServer,
					command: evt.target.value
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.args")), e$1("textarea", {
				className: "dsh-mcp-textarea",
				placeholder: t("form.argsPlaceholder"),
				rows: 3,
				value: (formServer.args || []).join("\n"),
				onChange: (evt) => setFormServer({
					...formServer,
					args: evt.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.cwd")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.cwdPlaceholder"),
				value: formServer.cwd || "",
				onChange: (evt) => setFormServer({
					...formServer,
					cwd: evt.target.value
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.env")), envEntries.length > 0 ? e$1("div", { className: "dsh-mcp-kv-list" }, envEntries.map((item, idx) => e$1("div", {
				key: idx,
				className: "dsh-mcp-kv-row"
			}, e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.envKey"),
				value: item.key,
				onChange: (evt) => {
					const next = [...envEntries];
					next[idx].key = evt.target.value;
					setEnvEntries(next);
				}
			}), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.envValue"),
				value: item.value,
				onChange: (evt) => {
					const next = [...envEntries];
					next[idx].value = evt.target.value;
					setEnvEntries(next);
				}
			}), e$1("button", {
				type: "button",
				className: "dsh-mcp-kv-del-btn",
				title: t("actions.delete"),
				onClick: () => {
					setEnvEntries(envEntries.filter((_, i) => i !== idx));
				}
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 15 }))))) : null, e$1("button", {
				type: "button",
				className: "dsh-mcp-add-btn",
				onClick: () => setEnvEntries([...envEntries, {
					key: "",
					value: ""
				}])
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), t("form.addEnv")))) : e$1(react.Fragment, null, e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.url")), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.urlPlaceholder"),
				value: formServer.url || "",
				onChange: (evt) => setFormServer({
					...formServer,
					url: evt.target.value
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.headers")), headerEntries.length > 0 ? e$1("div", { className: "dsh-mcp-kv-list" }, headerEntries.map((item, idx) => e$1("div", {
				key: idx,
				className: "dsh-mcp-kv-row"
			}, e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.headerKey"),
				value: item.key,
				onChange: (evt) => {
					const next = [...headerEntries];
					next[idx].key = evt.target.value;
					setHeaderEntries(next);
				}
			}), e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("form.headerValue"),
				value: item.value,
				onChange: (evt) => {
					const next = [...headerEntries];
					next[idx].value = evt.target.value;
					setHeaderEntries(next);
				}
			}), e$1("button", {
				type: "button",
				className: "dsh-mcp-kv-del-btn",
				title: t("actions.delete"),
				onClick: () => {
					setHeaderEntries(headerEntries.filter((_, i) => i !== idx));
				}
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 15 }))))) : null, e$1("button", {
				type: "button",
				className: "dsh-mcp-add-btn",
				onClick: () => setHeaderEntries([...headerEntries, {
					key: "",
					value: ""
				}])
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), t("form.addHeader")))), e$1("div", { className: "dsh-mcp-advanced-box" }, e$1("div", {
				className: "dsh-mcp-advanced-header",
				role: "button",
				tabIndex: 0,
				onClick: () => setShowAdvanced((prev) => !prev)
			}, e$1("div", { className: "dsh-mcp-advanced-title-wrap" }, e$1("span", { className: "dsh-mcp-advanced-title" }, t("form.advancedTitle")), e$1("span", { className: "dsh-mcp-advanced-badge" }, showAdvanced ? "收起" : "展开配置"))), showAdvanced ? e$1("div", { className: "dsh-mcp-advanced-content" }, e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.toolCallTimeoutMs")), e$1("input", {
				type: "number",
				min: 1e3,
				step: 1e3,
				className: "dsh-sam-select",
				placeholder: t("form.toolCallTimeoutMsPlaceholder"),
				value: formServer.toolCallTimeoutMs !== void 0 ? formServer.toolCallTimeoutMs : "",
				onChange: (evt) => setFormServer({
					...formServer,
					toolCallTimeoutMs: evt.target.value ? parseInt(evt.target.value, 10) : void 0
				})
			}), e$1("span", { className: "dsh-mcp-field-hint" }, t("form.toolCallTimeoutMsDesc"))), e$1("div", {
				className: `dsh-mcp-switch-card mini ${formServer.failOnStartupError ? "active" : ""}`,
				role: "button",
				tabIndex: 0,
				onClick: () => setFormServer({
					...formServer,
					failOnStartupError: !formServer.failOnStartupError
				})
			}, e$1("div", { className: "dsh-mcp-switch-text" }, e$1("div", { className: "dsh-mcp-switch-title" }, t("form.failOnStartupError")), e$1("div", { className: "dsh-mcp-switch-desc" }, t("form.failOnStartupErrorDesc"))), e$1("div", {
				className: `dsh-mcp-switch-btn ${formServer.failOnStartupError ? "active" : ""}`,
				"aria-hidden": "true"
			}, e$1("span", { className: "dsh-mcp-switch-thumb" }))), e$1("div", {
				className: `dsh-mcp-switch-card mini ${formServer.reconnect?.enabled !== false ? "active" : ""}`,
				role: "button",
				tabIndex: 0,
				onClick: () => setFormServer({
					...formServer,
					reconnect: {
						...formServer.reconnect,
						enabled: formServer.reconnect?.enabled === false
					}
				})
			}, e$1("div", { className: "dsh-mcp-switch-text" }, e$1("div", { className: "dsh-mcp-switch-title" }, t("form.reconnectEnabled")), e$1("div", { className: "dsh-mcp-switch-desc" }, t("form.reconnectEnabledDesc"))), e$1("div", {
				className: `dsh-mcp-switch-btn ${formServer.reconnect?.enabled !== false ? "active" : ""}`,
				"aria-hidden": "true"
			}, e$1("span", { className: "dsh-mcp-switch-thumb" }))), formServer.reconnect?.enabled !== false ? e$1("div", { className: "dsh-mcp-form-row-3" }, e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.reconnectInitialDelayMs")), e$1("input", {
				type: "number",
				min: 0,
				step: 100,
				className: "dsh-sam-select",
				placeholder: t("form.reconnectInitialDelayMsPlaceholder"),
				value: formServer.reconnect?.initialDelayMs !== void 0 ? formServer.reconnect.initialDelayMs : "",
				onChange: (evt) => setFormServer({
					...formServer,
					reconnect: {
						...formServer.reconnect,
						initialDelayMs: evt.target.value ? parseInt(evt.target.value, 10) : void 0
					}
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.reconnectMaxDelayMs")), e$1("input", {
				type: "number",
				min: 0,
				step: 1e3,
				className: "dsh-sam-select",
				placeholder: t("form.reconnectMaxDelayMsPlaceholder"),
				value: formServer.reconnect?.maxDelayMs !== void 0 ? formServer.reconnect.maxDelayMs : "",
				onChange: (evt) => setFormServer({
					...formServer,
					reconnect: {
						...formServer.reconnect,
						maxDelayMs: evt.target.value ? parseInt(evt.target.value, 10) : void 0
					}
				})
			})), e$1("div", { className: "dsh-sam-field-group" }, e$1("label", { className: "dsh-sam-field-label" }, t("form.reconnectMaxAttempts")), e$1("input", {
				type: "number",
				min: 0,
				step: 1,
				className: "dsh-sam-select",
				placeholder: t("form.reconnectMaxAttemptsPlaceholder"),
				value: formServer.reconnect?.maxAttempts !== void 0 ? formServer.reconnect.maxAttempts : "",
				onChange: (evt) => setFormServer({
					...formServer,
					reconnect: {
						...formServer.reconnect,
						maxAttempts: evt.target.value ? parseInt(evt.target.value, 10) : void 0
					}
				})
			}))) : null) : null)), e$1("div", { className: "dsh-sam-actions dsh-mcp-modal-footer" }, e$1("div", { className: "dsh-mcp-modal-footer-left" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: formTesting || formSaving,
				onClick: handleFormTest,
				title: t("actions.test")
			}, formTesting ? e$1(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
				size: 14,
				className: "dsh-spin"
			}) : e$1(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, { size: 14 }), formTesting ? t("actions.testing") : t("actions.test")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: formTesting || formSaving,
				onClick: handleFormOpenTools,
				title: t("actions.toolsList")
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutline14, { size: 14 }), t("actions.toolsList"), formServer.disabledTools && formServer.disabledTools.length > 0 ? e$1("span", { className: "dsh-mcp-mini-badge danger" }, String(formServer.disabledTools.length)) : null)), e$1("div", { className: "dsh-mcp-modal-footer-right" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: formSaving || formTesting,
				onClick: () => setFormOpen(false)
			}, t("actions.cancel")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				disabled: formSaving || formTesting,
				onClick: handleSaveForm
			}, formSaving ? t("actions.saving") : t("actions.save")))))) : null, toolsModalOpen && toolsTargetServer ? e$1("div", {
				className: "dsh-sam-modal-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setToolsModalOpen(false);
				}
			}, e$1("div", { className: "dsh-sam-modal-panel dsh-mcp-tools-modal" }, e$1("div", { className: "dsh-sam-header-row" }, e$1("div", null, e$1("h3", { className: "dsh-sam-title" }, t("toolsModal.title")), e$1("div", { className: "dsh-mcp-tools-header-meta" }, e$1("span", { className: "dsh-mcp-card-name" }, toolsTargetServer.name || toolsTargetServer.id), e$1("span", { className: "dsh-mcp-card-id" }, toolsTargetServer.id), e$1("span", { className: `dsh-mcp-proto-badge ${toolsTargetServer.transport || "streamable-http-or-sse"}` }, toolsTargetServer.transport === "stdio" ? "STDIO" : toolsDetectedTransport === "sse" ? "SSE" : toolsDetectedTransport === "streamable-http" ? "Streamable HTTP" : "HTTP / SSE"), toolsServerInfo?.version ? e$1("span", {
				className: "dsh-mcp-proto-badge server-version",
				title: toolsServerInfo.protocolVersion ? `MCP Protocol: ${toolsServerInfo.protocolVersion}${toolsServerInfo.name ? ` (${toolsServerInfo.name})` : ""}` : toolsServerInfo.name || void 0
			}, toolsServerInfo.name && toolsServerInfo.name !== toolsTargetServer.id && toolsServerInfo.name !== toolsTargetServer.name ? `${toolsServerInfo.name} ${toolsServerInfo.version}` : toolsServerInfo.version) : toolsServerInfo?.protocolVersion ? e$1("span", {
				className: "dsh-mcp-proto-badge server-version",
				title: toolsServerInfo.name || void 0
			}, `MCP ${toolsServerInfo.protocolVersion}`) : null, toolsTargetServer.compatibility?.status === "incompatible-2026-07-28" || toolsTargetServer.compatibility?.canEnable === false ? e$1("span", {
				className: "dsh-mcp-proto-badge incompatible",
				title: toolsTargetServer.compatibility.warning || t("compatibility.incompatibleDesc")
			}, t("compatibility.incompatibleBadge")) : toolsTargetServer.compatibility?.status === "downgrade-supported" ? e$1("span", {
				className: "dsh-mcp-proto-badge downgrade",
				title: toolsTargetServer.compatibility.warning || t("compatibility.downgradedDesc")
			}, t("compatibility.downgradedBadge", { version: toolsTargetServer.compatibility.negotiatedVersion || "2025-11-25" })) : null)), e$1("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setToolsModalOpen(false)
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$1("div", { className: "dsh-mcp-tools-toolbar" }, e$1("div", { className: "dsh-mcp-tools-search-box" }, e$1("input", {
				type: "text",
				className: "dsh-sam-select",
				placeholder: t("toolsModal.searchPlaceholder"),
				value: toolsSearch,
				onChange: (evt) => setToolsSearch(evt.target.value)
			})), e$1("div", { className: "dsh-mcp-tools-toolbar-actions" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: toolsLoading || toolsList.length === 0,
				onClick: () => handleToggleAllTools(true)
			}, t("toolsModal.enableAll")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: toolsLoading || toolsList.length === 0,
				onClick: () => handleToggleAllTools(false)
			}, t("toolsModal.disableAll")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: toolsLoading,
				onClick: () => fetchToolsForServer(toolsTargetServer),
				title: t("toolsModal.retry")
			}, toolsLoading ? e$1(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
				size: 14,
				className: "dsh-spin"
			}) : e$1(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 14 }), toolsLoading ? t("actions.toolsFetching") : t("toolsModal.retry")))), !toolsLoading && toolsList.length > 0 ? e$1("div", { className: "dsh-mcp-tools-stats-bar" }, e$1("span", null, t("toolsModal.summary", {
				total: toolsList.length,
				enabled: toolsList.length - toolsDisabledSet.size,
				disabled: toolsDisabledSet.size
			})), toolsSearch.trim() ? e$1("span", null, t("toolsModal.filteredSummary", { count: filteredTools.length })) : null) : null, toolsLoading ? e$1("div", {
				className: "dsh-sam-loading",
				style: { padding: "36px 0" }
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
				size: 20,
				className: "dsh-spin"
			}), e$1("span", { style: { marginLeft: 8 } }, t("toolsModal.fetching"))) : toolsError ? e$1("div", {
				className: "dsh-sam-notice error",
				style: { margin: "14px 0" }
			}, t("toolsModal.fetchFailed") + toolsError) : toolsList.length === 0 ? e$1("div", {
				className: "dsh-sam-desc",
				style: {
					padding: "32px 0",
					textAlign: "center"
				}
			}, t("toolsModal.serverNoTools")) : filteredTools.length === 0 ? e$1("div", {
				className: "dsh-sam-desc",
				style: {
					padding: "32px 0",
					textAlign: "center"
				}
			}, t("toolsModal.empty")) : e$1("div", { className: "dsh-mcp-tools-list" }, filteredTools.map((tool) => {
				const isDisabled = toolsDisabledSet.has(tool.name);
				const isSchemaExpanded = toolsExpandedSchemas.has(tool.name);
				const hasSchema = tool.inputSchema && Object.keys(tool.inputSchema).length > 0;
				return e$1("div", {
					key: tool.name,
					className: `dsh-mcp-tool-card ${isDisabled ? "disabled" : ""}`
				}, e$1("div", { className: "dsh-mcp-tool-card-main" }, e$1("div", { className: "dsh-mcp-tool-card-left" }, e$1("div", {
					className: `dsh-mcp-switch-btn ${!isDisabled ? "active" : ""}`,
					role: "button",
					tabIndex: 0,
					style: {
						marginTop: 2,
						cursor: "pointer"
					},
					onClick: () => handleToggleTool(tool.name),
					onKeyDown: (evt) => {
						if (evt.key === "Enter" || evt.key === " ") {
							evt.preventDefault();
							handleToggleTool(tool.name);
						}
					},
					title: !isDisabled ? t("toolsModal.statusEnabled") : t("toolsModal.statusDisabled")
				}, e$1("span", { className: "dsh-mcp-switch-thumb" })), e$1("div", { className: "dsh-mcp-tool-info" }, e$1("div", { className: "dsh-mcp-tool-title-row" }, e$1("span", { className: "dsh-mcp-tool-name" }, tool.name), e$1("span", { className: `dsh-mcp-tool-status-pill ${!isDisabled ? "active" : "disabled"}` }, !isDisabled ? t("toolsModal.statusEnabled") : t("toolsModal.statusDisabled"))), tool.description ? e$1("p", { className: "dsh-mcp-tool-desc" }, tool.description) : null)), hasSchema ? e$1("button", {
					type: "button",
					className: `dsh-mcp-tool-schema-btn ${isSchemaExpanded ? "active" : ""}`,
					onClick: (evt) => {
						evt.stopPropagation();
						handleToggleSchema(tool.name);
					}
				}, isSchemaExpanded ? t("toolsModal.hideParameters") : t("toolsModal.parameters")) : null), isSchemaExpanded && hasSchema ? (() => {
					const params = parseToolParameters(tool.inputSchema);
					const mode = toolSchemaModes[tool.name] || "list";
					const requiredCount = params.filter((p) => p.required).length;
					return e$1("div", { className: "dsh-mcp-tool-expanded-box" }, e$1("div", { className: "dsh-mcp-tool-expanded-header" }, e$1("span", { className: "dsh-mcp-tool-param-stats" }, params.length > 0 ? t("toolsModal.paramsCount", {
						total: params.length,
						required: requiredCount
					}) : t("toolsModal.noParams")), e$1("div", { className: "dsh-mcp-tool-view-switch" }, e$1("button", {
						type: "button",
						className: `dsh-mcp-seg-btn ${mode === "list" ? "active" : ""}`,
						onClick: (evt) => {
							evt.stopPropagation();
							setToolSchemaModes((prev) => ({
								...prev,
								[tool.name]: "list"
							}));
						}
					}, t("toolsModal.viewList")), e$1("button", {
						type: "button",
						className: `dsh-mcp-seg-btn ${mode === "raw" ? "active" : ""}`,
						onClick: (evt) => {
							evt.stopPropagation();
							setToolSchemaModes((prev) => ({
								...prev,
								[tool.name]: "raw"
							}));
						}
					}, t("toolsModal.viewRaw")))), mode === "list" ? params.length > 0 ? e$1("div", { className: "dsh-mcp-tool-params-list" }, params.map((param) => e$1("div", {
						key: param.name,
						className: "dsh-mcp-param-row"
					}, e$1("div", { className: "dsh-mcp-param-top" }, e$1("span", { className: "dsh-mcp-param-name" }, param.name), e$1("span", { className: "dsh-mcp-param-type" }, param.type), e$1("span", { className: `dsh-mcp-param-badge ${param.required ? "required" : "optional"}` }, param.required ? t("toolsModal.required") : t("toolsModal.optional")), param.default !== void 0 ? e$1("span", { className: "dsh-mcp-param-default" }, `${t("toolsModal.defaultVal")}${JSON.stringify(param.default)}`) : null), param.description ? e$1("p", { className: "dsh-mcp-param-desc" }, param.description) : null, param.enum && param.enum.length > 0 ? e$1("div", { className: "dsh-mcp-param-enum" }, `${t("toolsModal.enumVal")}${param.enum.map((v) => JSON.stringify(v)).join(" | ")}`) : null))) : null : e$1("pre", { className: "dsh-mcp-tool-schema-preview" }, JSON.stringify(tool.inputSchema, null, 2)));
				})() : null);
			})), e$1("div", {
				className: "dsh-sam-actions dsh-mcp-modal-footer",
				style: { marginTop: 14 }
			}, e$1("div", { className: "dsh-mcp-modal-footer-left" }, toolsDisabledSet.size > 0 ? e$1("span", { className: "dsh-mcp-proto-badge disabled-tools" }, t("toolsModal.disabledBadge", { count: toolsDisabledSet.size })) : null), e$1("div", { className: "dsh-mcp-modal-footer-right" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				disabled: toolsSaving,
				onClick: () => setToolsModalOpen(false)
			}, t("actions.cancel")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				disabled: toolsSaving || toolsLoading,
				onClick: handleSaveToolsModal
			}, toolsSaving ? t("toolsModal.saving") : t("toolsModal.save")))))) : null, importOpen ? e$1("div", {
				className: "dsh-sam-modal-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setImportOpen(false);
				}
			}, e$1("div", { className: "dsh-sam-modal-panel dsh-mcp-import-modal" }, e$1("div", { className: "dsh-sam-header-row" }, e$1("h3", { className: "dsh-sam-title" }, t("importModal.title")), e$1("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setImportOpen(false)
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$1("p", { className: "dsh-sam-desc" }, t("importModal.desc")), importError ? e$1("div", { className: "dsh-sam-notice error" }, importError) : null, e$1("textarea", {
				className: "dsh-mcp-import-textarea",
				rows: 10,
				placeholder: t("importModal.placeholder"),
				value: importText,
				onChange: (evt) => setImportText(evt.target.value)
			}), e$1("div", { className: "dsh-sam-actions" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				disabled: importing || !importText.trim(),
				onClick: handleImportSubmit
			}, importing ? t("importModal.importing") : t("importModal.confirm")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => setImportOpen(false)
			}, t("actions.cancel"))))) : null, saveConfirm?.open ? e$1("div", {
				className: "dsh-sam-modal-overlay dsh-mcp-confirm-overlay",
				onClick: (evt) => {
					if (evt.target === evt.currentTarget) setSaveConfirm(null);
				}
			}, e$1("div", { className: "dsh-sam-modal-panel dsh-mcp-confirm-modal" }, e$1("div", { className: "dsh-sam-header-row" }, e$1("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: "8px"
			} }, e$1(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { size: 18 }), e$1("h3", { className: "dsh-sam-title" }, t("saveConfirmModal.title"))), e$1("button", {
				type: "button",
				className: "dsh-sam-close-btn",
				onClick: () => setSaveConfirm(null)
			}, e$1(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 }))), e$1("p", { className: "dsh-mcp-confirm-msg" }, t("saveConfirmModal.message")), e$1("div", { className: "dsh-mcp-confirm-detail" }, saveConfirm.message), e$1("p", { className: "dsh-mcp-confirm-prompt" }, t("saveConfirmModal.prompt")), e$1("div", { className: "dsh-sam-actions" }, e$1("button", {
				type: "button",
				className: "dsh-sam-btn secondary",
				onClick: () => setSaveConfirm(null)
			}, t("saveConfirmModal.cancel")), e$1("button", {
				type: "button",
				className: "dsh-sam-btn primary",
				onClick: () => executeSave(saveConfirm.payload)
			}, t("saveConfirmModal.saveAnyway"))))) : null);
		}
		//#endregion
		//#region src/client/styles.ts
		const CSS = `
/* ----------------------------------------------------
   Session Settings View Page (conversation.view Tab after 轨迹)
   Hide bottom composer & make settings page fill bottom
   ---------------------------------------------------- */
[data-conversation-scroll]:has([data-session-settings-view]) > [data-composer-seat],
[data-conversation-scroll]:has(.dsh-session-view-root) > [data-composer-seat],
:has(> * > * > [data-session-settings-view]) > [data-composer-seat],
:has(> * > * > .dsh-session-view-root) > [data-composer-seat],
[data-conversation-scroll]:has([data-session-settings-view]) [class*="composerSeat"],
[data-conversation-scroll]:has(.dsh-session-view-root) [class*="composerSeat"] {
  display: none !important;
}

[data-conversation-scroll]:has([data-session-settings-view]),
[data-conversation-scroll]:has(.dsh-session-view-root) {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
  scrollbar-gutter: auto !important;
}

[data-conversation-scroll]:has([data-session-settings-view]) > [data-slot="conversation.session"],
[data-conversation-scroll]:has(.dsh-session-view-root) > [data-slot="conversation.session"],
[data-conversation-scroll]:has([data-session-settings-view]) [data-slot="conversation.view"],
[data-conversation-scroll]:has(.dsh-session-view-root) [data-slot="conversation.view"],
[data-conversation-scroll]:has([data-session-settings-view]) [class*="viewArea"],
[data-conversation-scroll]:has(.dsh-session-view-root) [class*="viewArea"] {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

.dsh-session-view-root {
  background: var(--dsw-alias-bg-layer-1);
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.dsh-session-view-root * {
  box-sizing: border-box;
}

/* Header & Clone Toolbar */
.dsh-session-view-header {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 24px;
}
.dsh-session-view-header-left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.dsh-session-view-title {
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  margin: 0;
}

/* Session ID Chip */
.dsh-session-id-chip {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  font-family: monospace;
  font-size: 12px;
  gap: 6px;
  line-height: 16px;
  padding: 4px 10px;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
}
.dsh-session-id-chip:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
}
.dsh-session-id-chip.copied {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.dsh-sam-status-badge {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
}
.dsh-sam-status-badge.badge-default {
  background: rgba(147, 51, 234, 0.12);
  color: #a855f7;
}
.dsh-sam-status-badge.badge-custom {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

/* Clone Toolbar */
.dsh-clone-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-clone-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 500;
}
.dsh-clone-input {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  height: 30px;
  outline: none;
  padding: 0 10px;
  transition: border-color 0.15s;
  width: 250px;
}
.dsh-clone-input:focus {
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-clone-btn {
  font-size: 12px;
  height: 30px;
  padding: 0 12px;
}
.dsh-btn-icon-left {
  margin-right: 6px;
}

.dsh-view-notice {
  margin: 12px 24px 0;
}

/* Split Body */
.dsh-session-view-body {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  overflow: hidden;
}

/* Left Sub-sidebar (clean layout: icon + title + badge) */
.dsh-session-view-sidebar {
  background: var(--dsw-alias-bg-layer-2);
  border-right: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  overflow-y: auto;
  padding: 16px 12px;
  width: 230px;
}
.dsh-view-sidebar-item {
  align-items: center;
  background: 0 0;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
  transition: background-color 0.15s, border-color 0.15s;
  width: 100%;
}
.dsh-view-sidebar-item:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-view-sidebar-item.active {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l2);
  box-shadow: var(--dsw-shadow-lv1);
}
.dsh-view-item-icon {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 6px;
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}
.dsh-view-sidebar-item.active .dsh-view-item-icon {
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
}
.dsh-view-item-title {
  color: var(--dsw-alias-label-primary);
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
}
.dsh-view-sidebar-item.active .dsh-view-item-title {
  font-weight: 600;
}
.dsh-view-item-badge {
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  flex-shrink: 0;
  font-size: 11px;
  max-width: 80px;
  overflow: hidden;
  padding: 2px 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-view-item-badge.highlight {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  font-weight: 600;
}

/* Right Content Panel */
.dsh-session-view-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 24px 32px 60px;
}
.dsh-view-content-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 760px;
}

/* Section Header inside Content Panel */
.dsh-section-header {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
  padding-bottom: 12px;
}
.dsh-section-title {
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  margin: 0;
}
.dsh-section-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
  margin: 0;
}

/* Footer Actions */
.dsh-session-view-footer {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 28px;
}
.dsh-view-footer-left {
  align-items: center;
  display: flex;
  gap: 10px;
}
.dsh-view-footer-right {
  align-items: center;
  display: flex;
  gap: 10px;
}

/* Forms & Selectors */
.dsh-sam-mode-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-sam-mode-item {
  align-items: flex-start;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  transition: border-color 0.15s, background-color 0.15s;
}
.dsh-sam-mode-item:hover {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-sam-mode-item.selected {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-sam-mode-item input[type="radio"] {
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
  margin-top: 3px;
}
.dsh-sam-mode-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dsh-sam-mode-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
}
.dsh-sam-mode-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-sam-fields-panel {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}
.dsh-sam-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dsh-sam-field-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
}
.dsh-sam-select {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  height: 36px;
  line-height: 20px;
  max-width: 100%;
  min-width: 0;
  padding: 0 10px;
  width: 100%;
}
.dsh-sam-select:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh-sam-select:disabled {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  cursor: not-allowed;
  opacity: 0.7;
}
.dsh-sam-notice {
  border-radius: 6px;
  font-size: 13px;
  line-height: 20px;
  padding: 10px 14px;
}
.dsh-sam-notice.success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}
.dsh-sam-notice.error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.dsh-sam-notice.info {
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}
.dsh-sam-notices-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 16px;
}
.dsh-sam-notices-block .dsh-sam-notice {
  margin: 0;
}
.dsh-sam-btn {
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  height: 36px;
  justify-content: center;
  padding: 0 16px;
  transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
}
.dsh-sam-btn.primary {
  background: var(--dsw-alias-brand-primary);
  border: 1px solid var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
}
.dsh-sam-btn.primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-brand-primary));
  border-color: var(--dsw-alias-button-primary-hover, var(--dsw-alias-brand-primary));
}
.dsh-sam-btn.secondary {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn.secondary:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-sam-btn.default-btn {
  background: rgba(147, 51, 234, 0.12);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn.default-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.22);
}
.dsh-sam-btn.tertiary {
  background: 0 0;
  border: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
}
.dsh-sam-btn.tertiary:hover {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* MCP session checklist */
.dsh-session-mcp-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-mcp-quick-bar {
  align-items: center;
  display: flex;
  gap: 10px;
  margin-bottom: 2px;
}
.dsh-mcp-select-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  line-height: 16px;
  padding: 6px 12px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-select-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-1));
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-select-btn.active {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-mcp-text-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  line-height: 16px;
  padding: 6px 12px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-text-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-1));
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-mcp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-session-mcp-item {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  outline: none;
  padding: 12px 16px;
  transition: background-color 0.15s, border-color 0.15s;
  user-select: none;
}
.dsh-session-mcp-item:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-mcp-item:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -1px;
}
.dsh-session-mcp-item.active {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-session-mcp-item.readonly {
  cursor: default;
  opacity: 0.8;
}
.dsh-session-mcp-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh-session-mcp-row1 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}
.dsh-session-mcp-title-wrap {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-session-mcp-name {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
}
.dsh-session-mcp-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
  margin: 0;
}
.dsh-session-mcp-target {
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  display: inline-block;
  font-family: monospace;
  font-size: 11px;
  overflow: hidden;
  padding: 2px 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-session-mcp-check {
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex: none;
}
.dsh-session-mcp-tools-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-session-tools-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 11px;
  font-weight: 500;
  gap: 4px;
  line-height: 14px;
  padding: 3px 8px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-session-tools-btn:hover {
  background: var(--dsw-alias-bg-layer-3);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-session-tools-mode-badge {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-session-tools-mode-badge.default {
  background: rgba(147, 51, 234, 0.1);
  color: #a855f7;
}
.dsh-session-tools-mode-badge.custom {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-session-tools-mode-badge.all-active {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-session-tools-modes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

/* ----------------------------------------------------
   MCP Servers Management (Settings -> Plugins Tab)
   ---------------------------------------------------- */
.dsh-mcp-settings-page {
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.dsh-mcp-header-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-mcp-header-title-row {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}
.dsh-mcp-page-title {
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  margin: 0;
}
.dsh-mcp-page-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 4px 0 0;
}
.dsh-mcp-header-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* Server Cards List */
.dsh-mcp-server-list {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}
.dsh-mcp-server-card {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dsh-mcp-server-card:hover {
  border-color: var(--dsw-alias-border-l2);
}
.dsh-mcp-card-top {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
.dsh-mcp-card-identity {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}
.dsh-mcp-transport-icon {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 8px;
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex: none;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.dsh-mcp-title-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dsh-mcp-card-name {
  color: var(--dsw-alias-label-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}
.dsh-mcp-card-id {
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
}
.dsh-mcp-badges {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-mcp-proto-badge {
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
}
.dsh-mcp-proto-badge.stdio {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.dsh-mcp-proto-badge.streamable-http-or-sse,
.dsh-mcp-proto-badge.streamable-http {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-mcp-proto-badge.sse {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-mcp-proto-badge.timeout {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}
.dsh-mcp-proto-badge.incompatible {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.dsh-mcp-proto-badge.downgrade {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.dsh-mcp-default-badge {
  background: rgba(147, 51, 234, 0.12);
  border-radius: 4px;
  color: #a855f7;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
}
.dsh-mcp-card-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
  margin: 0;
}
.dsh-mcp-target-box {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  padding: 8px 10px;
}
.dsh-mcp-code-preview {
  color: var(--dsw-alias-label-primary);
  display: block;
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.dsh-mcp-inline-test {
  align-items: center;
  border-radius: 6px;
  display: flex;
  font-size: 12px;
  gap: 6px;
  line-height: 16px;
  padding: 6px 10px;
}
.dsh-mcp-inline-test.success {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-mcp-inline-test.error {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
.dsh-mcp-card-footer {
  align-items: center;
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  padding-top: 10px;
}
.dsh-mcp-mini-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 12px;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  transition: background-color 0.15s;
}
.dsh-mcp-mini-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-mcp-footer-right {
  align-items: center;
  display: flex;
  gap: 6px;
}
.dsh-mcp-icon-btn {
  align-items: center;
  background: 0 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s, color 0.15s;
  width: 28px;
}
.dsh-mcp-icon-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Empty Card */
.dsh-mcp-empty-card {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.dsh-mcp-empty-icon {
  color: var(--dsw-alias-label-secondary);
}
.dsh-mcp-empty-text {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  max-width: 400px;
}

/* Form Modal Elements */
.dsh-sam-modal-overlay {
  align-items: center;
  backdrop-filter: var(--dsw-mask-blur);
  background: var(--dsw-alias-bg-mask-1);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}
.dsh-sam-modal-panel {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 20px;
  box-shadow: var(--dsw-shadow-lv3);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: min(680px, calc(100vh - 48px));
  max-width: calc(100vw - 48px);
  overflow-y: auto;
  padding: 24px 28px;
  position: relative;
  width: 680px;
  z-index: 1;
}
.dsh-sam-modal-panel * {
  box-sizing: border-box;
}
.dsh-mcp-form-modal {
  width: 720px;
}
.dsh-sam-header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.dsh-sam-title {
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  margin: 0;
}
.dsh-sam-close-btn {
  align-items: center;
  background: 0 0;
  border: none;
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;
}
.dsh-sam-close-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
}

/* Top Switch Card */
.dsh-mcp-switch-card {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  outline: none;
  padding: 12px 16px;
  transition: border-color 0.15s, background-color 0.15s;
  user-select: none;
}
.dsh-mcp-switch-card:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-switch-card:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh-mcp-switch-card.active {
  border-color: var(--dsw-alias-state-success-primary);
}
.dsh-mcp-switch-card.disabled {
  cursor: not-allowed !important;
  opacity: 0.55;
}
.dsh-mcp-switch-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh-mcp-switch-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}
.dsh-mcp-switch-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
}
.dsh-mcp-switch-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9999px;
  display: inline-flex;
  flex-shrink: 0;
  height: 24px;
  padding: 2px;
  pointer-events: none;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
  width: 44px;
}
.dsh-mcp-switch-btn.active {
  background: var(--dsw-alias-state-success-primary);
  border-color: var(--dsw-alias-state-success-primary);
}
.dsh-mcp-switch-thumb {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: block;
  height: 18px;
  transform: translateX(0);
  transition: transform 0.2s ease-in-out;
  width: 18px;
}
.dsh-mcp-switch-btn.active .dsh-mcp-switch-thumb {
  transform: translateX(20px);
}

.dsh-mcp-form-row {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
.flex-1 {
  flex: 1;
  min-width: 0;
}
.dsh-mcp-textarea {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  line-height: 18px;
  padding: 8px 10px;
  resize: vertical;
  width: 100%;
}
.dsh-mcp-textarea:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
/* KV Rows for Headers & ENV */
.dsh-mcp-kv-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-mcp-kv-row {
  align-items: center;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(120px, 0.8fr) minmax(180px, 1.2fr) 34px;
  width: 100%;
}
.dsh-mcp-kv-row .dsh-sam-select {
  height: 34px;
}
.dsh-mcp-kv-del-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
  width: 34px;
}
.dsh-mcp-kv-del-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Add Item Button styled like cust-model-editor */
.dsh-mcp-add-btn {
  align-items: center;
  align-self: flex-start;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  height: 32px;
  justify-content: center;
  line-height: 20px;
  margin-top: 4px;
  padding: 0 12px;
  transition: background-color 0.15s, border-color 0.15s;
}
.dsh-mcp-add-btn:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}

/* Advanced Settings Box */
.dsh-mcp-advanced-box {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s;
}
.dsh-mcp-advanced-header {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  outline: none;
  padding: 12px 16px;
  user-select: none;
}
.dsh-mcp-advanced-header:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-mcp-advanced-header:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -1px;
}
.dsh-mcp-advanced-title-wrap {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-advanced-title {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
}
.dsh-mcp-advanced-badge {
  color: var(--dsw-alias-brand-primary);
  font-size: 12px;
  font-weight: 500;
}
.dsh-mcp-advanced-content {
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}
.dsh-mcp-switch-card.mini {
  padding: 10px 14px;
}
.dsh-mcp-form-row-3 {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
}
.dsh-mcp-field-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
  margin-top: 2px;
}

.dsh-sam-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.dsh-mcp-modal-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-modal-footer-left,
.dsh-mcp-modal-footer-right {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* Import Modal */
.dsh-mcp-import-modal {
  width: 680px;
}
.dsh-mcp-import-modal .dsh-sam-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 6px 0 10px;
}
.dsh-mcp-import-textarea {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex: 1 1 0%;
  font-family: monospace;
  font-size: 12px;
  line-height: 18px;
  min-height: 280px;
  padding: 12px 14px;
  resize: vertical;
  width: 100%;
}
.dsh-mcp-import-textarea:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}

/* Tools Management Modal & Tool Cards */
.dsh-mcp-tools-modal {
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  max-width: 780px;
  width: 92vw;
}
.dsh-mcp-tools-header-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-mcp-tools-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin: 10px 0;
}
.dsh-mcp-tools-search-box {
  flex: 1 1 200px;
  min-width: 180px;
}
.dsh-mcp-search-wrap {
  align-items: center;
  display: flex;
  position: relative;
  width: 100%;
}
.dsh-mcp-search-icon {
  color: var(--dsw-alias-label-tertiary);
  left: 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.dsh-mcp-search-input {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  height: 34px;
  line-height: 20px;
  padding: 0 10px 0 32px;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}
.dsh-mcp-search-input:focus {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
  outline: none;
}
.dsh-mcp-search-input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-mcp-tools-toolbar-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}
.dsh-mcp-tools-stats-bar {
  align-items: center;
  color: var(--dsw-alias-label-secondary);
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  line-height: 18px;
  margin-bottom: 8px;
  padding: 0 2px;
}
.dsh-mcp-tools-list {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 8px;
  max-height: 480px;
  min-height: 120px;
  overflow-y: auto;
  padding-right: 4px;
}
.dsh-mcp-tool-card {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 14px;
  transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
}
.dsh-mcp-tool-card:hover {
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-tool-card.disabled {
  background: var(--dsw-alias-bg-layer-1);
  border-style: dashed;
  opacity: 0.85;
}
.dsh-mcp-tool-card-main {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-tool-card-left {
  align-items: flex-start;
  display: flex;
  flex: 1 1 0%;
  gap: 10px;
  min-width: 0;
  user-select: text;
}
.dsh-mcp-tool-card .dsh-mcp-switch-btn {
  cursor: pointer;
  pointer-events: auto;
}
.dsh-mcp-tool-desc,
.dsh-mcp-tool-name,
.dsh-mcp-tool-schema-preview {
  user-select: text;
}
.dsh-mcp-tool-card-right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.dsh-mcp-tool-info {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-width: 0;
}
.dsh-mcp-tool-title-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-mcp-tool-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  word-break: break-all;
}
.dsh-mcp-tool-status-pill {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-mcp-tool-status-pill.active {
  background: rgba(46, 160, 67, 0.15);
  color: var(--dsw-alias-state-success-primary, #2ea043);
}
.dsh-mcp-tool-status-pill.disabled {
  background: rgba(218, 54, 51, 0.15);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-tool-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  margin: 4px 0 0;
}
.dsh-mcp-tool-schema-btn,
.dsh-mcp-schema-toggle-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  line-height: 16px;
  padding: 4px 10px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-tool-schema-btn:hover,
.dsh-mcp-schema-toggle-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  border-color: var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
  text-decoration: none;
}
.dsh-mcp-tool-schema-btn.active,
.dsh-mcp-schema-toggle-btn.active {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-mcp-tool-schema-preview {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 11px;
  line-height: 16px;
  margin: 0;
  max-height: 220px;
  overflow: auto;
  padding: 8px 10px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Expanded Parameter Box & Segmented View */
.dsh-mcp-tool-expanded-box {
  border-top: 1px dashed var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
}
.dsh-mcp-tool-expanded-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}
.dsh-mcp-tool-param-stats {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 500;
}
.dsh-mcp-tool-view-switch {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  display: inline-flex;
  gap: 2px;
  padding: 2px;
}
.dsh-mcp-seg-btn {
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 11px;
  line-height: 14px;
  padding: 3px 8px;
  transition: background-color 0.15s, color 0.15s;
}
.dsh-mcp-seg-btn:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-seg-btn.active {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.dsh-mcp-tool-params-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 2px;
}
.dsh-mcp-param-row {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
}
.dsh-mcp-param-top {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-mcp-param-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}
.dsh-mcp-param-type {
  background: rgba(88, 166, 255, 0.1);
  border-radius: 4px;
  color: var(--dsw-alias-brand-primary);
  font-family: monospace;
  font-size: 11px;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-badge {
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-badge.required {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-param-badge.optional {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-mcp-param-default {
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 10px;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  margin: 0;
  word-break: break-word;
}
.dsh-mcp-param-enum {
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  font-family: monospace;
  font-size: 10px;
  line-height: 14px;
}
.dsh-mcp-mini-badge.danger {
  background: rgba(218, 54, 51, 0.15);
  border-radius: 4px;
  color: var(--dsw-alias-state-error-primary, #da3633);
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  margin-left: 4px;
  padding: 1px 5px;
}
.dsh-mcp-proto-badge.disabled-tools {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-proto-badge.server-version {
  background: rgba(88, 166, 255, 0.12);
  color: var(--dsw-alias-brand-primary, #58a6ff);
  font-family: monospace;
  font-weight: 600;
}

/* MCP Pre-save Test Confirmation Modal */
.dsh-mcp-confirm-overlay {
  z-index: 1050;
}
.dsh-mcp-confirm-modal {
  height: auto;
  max-height: min(520px, calc(100vh - 48px));
  max-width: 480px;
  min-height: unset;
  padding: 20px 24px;
  width: 90vw;
}
.dsh-mcp-confirm-modal .dsh-sam-header-row {
  margin-bottom: 12px;
}
.dsh-mcp-confirm-modal .dsh-sam-header svg {
  color: var(--dsw-alias-state-warning-primary, #d29922);
}
.dsh-mcp-confirm-msg {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  margin: 0 0 10px;
}
.dsh-mcp-confirm-detail {
  background: rgba(218, 54, 51, 0.08);
  border: 1px solid rgba(218, 54, 51, 0.2);
  border-radius: 6px;
  color: var(--dsw-alias-state-error-primary, #da3633);
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 12px;
  max-height: 160px;
  overflow-y: auto;
  padding: 8px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.dsh-mcp-confirm-prompt {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  margin: 0 0 16px;
}
.dsh-mcp-confirm-modal .dsh-sam-actions {
  margin-top: 0;
}

/* Skills Session Management */
.dsh-session-skills-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-skills-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 4px;
}
.dsh-skills-search-wrap {
  display: flex;
  flex: 1;
  min-width: 200px;
  position: relative;
}
.dsh-skills-search-input {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  outline: none;
  padding: 6px 10px 6px 30px;
  transition: border-color 0.15s;
  width: 100%;
}
.dsh-skills-search-input:focus {
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-skills-search-icon {
  color: var(--dsw-alias-label-secondary);
  left: 8px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.dsh-skills-btn-group {
  align-items: center;
  display: flex;
  gap: 8px;
}
.dsh-session-skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-session-skill-item {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  transition: background-color 0.15s, border-color 0.15s;
  width: 100%;
}
.dsh-session-skill-item:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-skill-item.active {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l2);
}
.dsh-session-skill-item.active:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-skill-item.disabled {
  opacity: 0.7;
}
.dsh-session-skill-item.readonly {
  cursor: default;
}
.dsh-session-skill-main {
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  user-select: none;
  width: 100%;
}
.dsh-session-skill-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh-session-skill-row1 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-session-skill-title-wrap {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-session-skill-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
}
.dsh-session-skill-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  margin: 0;
}
.dsh-skill-badge {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-skill-badge.source-project {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.dsh-skill-badge.source-user {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-skill-badge.source-bundled {
  background: rgba(147, 51, 234, 0.12);
  color: #a855f7;
}
.dsh-skill-badge.source-runtime {
  background: rgba(107, 114, 128, 0.15);
  color: var(--dsw-alias-label-secondary);
}
.dsh-skill-badge.inv-model {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-skill-badge.status-disabled {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-skill-badge.status-enabled {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-skill-actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.dsh-skill-config-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  line-height: 16px;
  padding: 5px 12px;
  transition: all 0.15s ease;
}
.dsh-skill-config-btn:hover {
  background: var(--dsw-alias-bg-layer-3);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}

/* Standalone Skill Modal */
.dsh-skill-modal {
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: 88vh;
  max-width: 720px;
  width: 90vw;
}
.dsh-skill-modal-header-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-skill-modal-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 16px;
  max-height: calc(88vh - 140px);
  overflow-y: auto;
  padding: 8px 2px;
}
.dsh-skill-modal-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-skill-modal-section-title {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  margin: 0;
}
.dsh-skill-modal-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 0;
}
.dsh-skill-runtime-note {
  background: rgba(245, 158, 11, 0.08);
  border: 1px dashed rgba(245, 158, 11, 0.3);
  border-radius: 6px;
  color: var(--dsw-alias-state-warning-primary, #f59e0b);
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;
}
.dsh-skill-detail-meta {
  color: var(--dsw-alias-label-secondary);
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 4px;
}
.dsh-skill-detail-path {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  word-break: break-all;
}
.dsh-skill-content-block {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  line-height: 18px;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
  padding: 12px 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

@keyframes dsh-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.dsh-spin {
  animation: dsh-spin 1s linear infinite;
}
`;
		//#endregion
		//#region src/client/index.ts
		const e = react.createElement;
		const inject = [
			"slots",
			"connection",
			"locale"
		];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(LOCALE_NS, {
				zh: flattenDictionary(zh),
				en: flattenDictionary(en)
			}), "session-settings: locale");
			let translator = ctx.locale.bind(LOCALE_NS);
			ctx.effect(() => ctx.locale.subscribe(() => {
				translator = ctx.locale.bind(LOCALE_NS);
			}), "session-settings: locale updates");
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = "@local/dsh-session-settings";
				style.textContent = CSS;
				document.head.appendChild(style);
				return () => style.remove();
			}, "session-settings: styles");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "mcp-servers",
				order: 25,
				label: () => translator("mcpServers.tabLabel")
			}, function McpSettingsSection(props) {
				const t = react.useCallback((key, vars) => {
					let res = translator(key, vars);
					if (res && res !== key) return res;
					if (!key.startsWith("mcpServers.")) {
						res = translator(`mcpServers.${key}`, vars);
						if (res && res !== `mcpServers.${key}`) return res;
					}
					if (!key.startsWith("sessionSettings.")) {
						res = translator(`sessionSettings.mcp.${key}`, vars);
						if (res && res !== `sessionSettings.mcp.${key}`) return res;
						res = translator(`sessionSettings.${key}`, vars);
						if (res && res !== `sessionSettings.${key}`) return res;
					}
					return res || key;
				}, []);
				return e(McpServersSettingsTab, {
					...props,
					api: ctx.connection.api,
					t
				});
			}));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "skills",
				order: 26,
				label: () => translator("skillsSettings.tabLabel")
			}, function SkillsSettingsSection(props) {
				const t = react.useCallback((key, vars) => {
					let res = translator(key, vars);
					if (res && res !== key) return res;
					const cleanKey = key.replace(/^sessionSettings\.skills\./, "");
					res = translator(`skillsSettings.${cleanKey}`, vars);
					if (res && res !== `skillsSettings.${cleanKey}`) return res;
					res = translator(`sessionSettings.skills.${cleanKey}`, vars);
					if (res && res !== `sessionSettings.skills.${cleanKey}`) return res;
					res = translator(`skillsSettings.${key}`, vars);
					if (res && res !== `skillsSettings.${key}`) return res;
					res = translator(`sessionSettings.${key}`, vars);
					if (res && res !== `sessionSettings.${key}`) return res;
					return key;
				}, []);
				return e(SkillsSettingsTab, {
					...props,
					api: ctx.connection.api,
					t
				});
			}));
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "session-settings",
				order: 20,
				label: () => translator("sessionSettings.title")
			}, function SessionSettingsTabSlot(props) {
				const t = react.useCallback((key, vars) => {
					let res = translator(key, vars);
					if (res && res !== key) return res;
					if (!key.startsWith("sessionSettings.")) {
						res = translator(`sessionSettings.${key}`, vars);
						if (res && res !== `sessionSettings.${key}`) return res;
					}
					return res || key;
				}, []);
				return e(SessionSettingsViewPage, {
					...props,
					api: ctx.connection.api,
					t
				});
			}));
			ctx.effect(() => {
				const updateNavIcons = () => {
					const navButtons = document.querySelectorAll("button[class*=\"navCell\"]");
					for (const btn of Array.from(navButtons)) {
						const label = btn.querySelector("span[class*=\"navLabel\"]");
						if (!label) continue;
						if (label.textContent === "MCP 服务器" || label.textContent === "MCP Servers") {
							const iconSvg = btn.querySelector("svg[class*=\"navIcon\"]");
							if (iconSvg && !iconSvg.getAttribute("data-mcp-official-icon")) {
								iconSvg.setAttribute("data-mcp-official-icon", "true");
								iconSvg.setAttribute("viewBox", "0 0 16 16");
								iconSvg.innerHTML = `
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12.3368 1.53569L11.931 4.43172H14.8086V5.79673H11.7404L11.1962 9.67859H14.2839V11.0436H11.0056L10.4994 14.6529L9.14873 14.4643L9.62731 11.0436H5.75876L5.25252 14.6529L3.90186 14.4643L4.38043 11.0436H1.69141V9.67859H4.57104L5.11417 5.79673H2.21609V4.43172H5.30581L5.73724 1.34713L7.08995 1.53569L6.68414 4.43172H10.5527L10.9841 1.34713L12.3368 1.53569ZM5.94937 9.67859H9.81791L10.361 5.79673H6.49353L5.94937 9.67859Z" />
            `;
							}
						}
						if (label.textContent === "技能" || label.textContent === "Skills") {
							const iconSvg = btn.querySelector("svg[class*=\"navIcon\"]");
							if (iconSvg && !iconSvg.getAttribute("data-skill-official-icon")) {
								iconSvg.setAttribute("data-skill-official-icon", "true");
								iconSvg.setAttribute("viewBox", "0 0 16 16");
								iconSvg.innerHTML = `
              <path fill="currentColor" d="M12.5113 15.4067C12.4395 15.6249 12.1308 15.6249 12.059 15.4067L11.643 14.1416C11.454 13.567 11.0033 13.1164 10.4288 12.9274L9.16369 12.5113C8.94544 12.4395 8.94544 12.1308 9.16369 12.059L10.4288 11.643C11.0033 11.454 11.454 11.0033 11.643 10.4288L12.059 9.16369C12.1308 8.94544 12.4395 8.94544 12.5113 9.16369L12.9274 10.4288C13.1164 11.0033 13.567 11.454 14.1416 11.643L15.4067 12.059C15.6249 12.1308 15.6249 12.4395 15.4067 12.5113L14.1416 12.9274C13.567 13.1164 13.1164 13.567 12.9274 14.1416L12.5113 15.4067Z" />
              <path fill="currentColor" d="M9.02246 0.546878C9.9822 0.546878 10.7564 0.545403 11.374 0.612307C12.0042 0.680586 12.5515 0.826244 13.0273 1.17188C13.3052 1.37376 13.5501 1.61868 13.752 1.89649C14.0975 2.37225 14.2432 2.91984 14.3115 3.54981C14.3784 4.16727 14.377 4.94206 14.377 5.90137V8.51367C13.9611 8.29533 13.5071 8.13985 13.0273 8.06055V5.90137C13.0273 4.9121 13.0259 4.22322 12.9688 3.69532C12.9129 3.18044 12.8098 2.89782 12.6592 2.69043C12.5406 2.52724 12.3966 2.38326 12.2334 2.26465C12.026 2.11404 11.7437 2.0109 11.2285 1.95508C10.7005 1.89789 10.0122 1.89649 9.02246 1.89649H6.55371C5.56395 1.89649 4.87569 1.89787 4.34766 1.95508C3.83242 2.01092 3.55022 2.11398 3.34278 2.26465C3.17953 2.38329 3.03564 2.52719 2.91699 2.69043C2.76642 2.89782 2.66325 3.18042 2.60742 3.69532C2.55027 4.22322 2.54883 4.9121 2.54883 5.90137V10.0986C2.54883 11.0878 2.55031 11.7768 2.60742 12.3047C2.66326 12.8196 2.76642 13.1032 2.91699 13.3105C3.03558 13.4736 3.17966 13.6178 3.34278 13.7363C3.5502 13.8869 3.83265 13.9901 4.34766 14.0459C4.87568 14.1031 5.56398 14.1035 6.55371 14.1035H8.08399C8.27443 14.6025 8.55077 15.0585 8.89551 15.4541H6.55371C5.59402 15.4541 4.81976 15.4546 4.20215 15.3877C3.57204 15.3194 3.02468 15.1738 2.54883 14.8281C2.27111 14.6263 2.02606 14.3813 1.82422 14.1035C1.47883 13.6278 1.33293 13.08 1.26465 12.4502C1.19783 11.8327 1.19922 11.0579 1.19922 10.0986V5.90137C1.19922 4.94206 1.1978 4.16727 1.26465 3.54981C1.33295 2.91984 1.47867 2.37225 1.82422 1.89649C2.02613 1.61864 2.27098 1.37379 2.54883 1.17188C3.02472 0.826181 3.57197 0.6806 4.20215 0.612307C4.81976 0.545393 5.594 0.546877 6.55371 0.546878H9.02246ZM9.19629 9.14649H4.5459V7.84571H9.19629V9.14649ZM11.0303 6.10645H4.5459V4.80567H11.0303V6.10645Z" />
            `;
							}
						}
					}
				};
				const observer = new MutationObserver(() => updateNavIcons());
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
				updateNavIcons();
				return () => observer.disconnect();
			}, "session-settings: sidebar nav icons");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map