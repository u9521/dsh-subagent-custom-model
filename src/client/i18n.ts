export const zh = {
  nav: '子代理模型',
  title: '子代理模型配置',
  desc: '为当前会话自定义子代理（Subagent / Subagent Fork / Workflow 等）调用的底层模型与思考等级。',
  sidebar: {
    label: '子代理模型',
    tooltip: '配置子代理模型',
  },
  scope: {
    currentSession: '当前会话',
    globalDefault: '全局默认配置',
    sessionCustom: '已为此会话单独配置',
    sessionDefault: '跟随全局默认设置',
  },
  status: {
    title: '生效配置',
    default: '默认',
    inherit: '继承',
    custom: '自定义',
  },
  mode: {
    default: {
      title: '使用全局默认配置',
      desc: '此会话不进行独立配置，直接继承并使用全局默认的子代理规则。',
    },
    inherit: {
      title: '跟随当前父会话模型',
      desc: '子代理无条件继承当前会话所选用的模型与思考等级。',
    },
    custom: {
      title: '指定此会话的子代理模型',
      desc: '为此会话单独指定专属的 Provider、Model 与思考等级（例如选用更轻快或更强推理的模型）。',
    },
  },
  field: {
    provider: '模型提供方 (Provider)',
    providerPlaceholder: '请选择提供方...',
    model: '模型名称 (Model)',
    modelPlaceholder: '请选择模型...',
    reasoningEffort: '思考等级 (Reasoning Effort)',
    reasoningEffortDefault: '模型默认 (Default)',
    reasoningOff: '关闭思考 (off)',
    reasoningMinimal: '极低思考 (minimal)',
    reasoningLow: '低思考 (low)',
    reasoningMedium: '中等思考 (medium)',
    reasoningHigh: '高思考 (high)',
    reasoningXhigh: '超高思考 (xhigh)',
    reasoningMax: '最大思考 (max)',
  },
  action: {
    save: '保存配置',
    saveSession: '保存此会话',
    saveDefault: '设为全局默认',
    saving: '保存中...',
    savingDefault: '设为默认中...',
    reset: '清除独立设置 (使用全局默认)',
    close: '关闭',
  },
  notice: {
    saved: '✓ 子代理模型配置已保存并对本会话即时生效！',
    savedDefault: '✓ 已成功更新全局默认子代理配置！',
    error: '保存失败：',
  },
  loading: '正在加载模型与配置...',
}

export const en = {
  nav: 'Subagent Models',
  title: 'Subagent Model Configuration',
  desc: 'Configure the language model and reasoning effort used by subagents (Subagent, Subagent Fork, Workflow) for this session.',
  sidebar: {
    label: 'Subagent Models',
    tooltip: 'Configure subagent models',
  },
  scope: {
    currentSession: 'Current Session',
    globalDefault: 'Global Default Config',
    sessionCustom: 'Custom configured for this session',
    sessionDefault: 'Using global default',
  },
  status: {
    title: 'Effective Config',
    default: 'Default',
    inherit: 'Inherit',
    custom: 'Custom',
  },
  mode: {
    default: {
      title: 'Use Global Default Config',
      desc: 'This session has no custom override and directly inherits the global default subagent rules.',
    },
    inherit: {
      title: 'Follow Current Parent Session Model',
      desc: 'Subagents unconditionally inherit the model and reasoning effort used by the parent session.',
    },
    custom: {
      title: 'Specify Custom Subagent Model',
      desc: 'Assign a dedicated provider, model, and reasoning effort for subagents in this session.',
    },
  },
  field: {
    provider: 'Model Provider',
    providerPlaceholder: 'Select provider...',
    model: 'Model Name',
    modelPlaceholder: 'Select model...',
    reasoningEffort: 'Reasoning Effort',
    reasoningEffortDefault: 'Model Default (Default)',
    reasoningOff: 'Disabled (off)',
    reasoningMinimal: 'Minimal',
    reasoningLow: 'Low',
    reasoningMedium: 'Medium',
    reasoningHigh: 'High',
    reasoningXhigh: 'Extra High',
    reasoningMax: 'Maximum',
  },
  action: {
    save: 'Save Configuration',
    saveSession: 'Save for Session',
    saveDefault: 'Set as Global Default',
    saving: 'Saving...',
    savingDefault: 'Setting default...',
    reset: 'Clear Override (Use Global Default)',
    close: 'Close',
  },
  notice: {
    saved: '✓ Subagent model configuration saved for this session!',
    savedDefault: '✓ Successfully updated global default subagent config!',
    error: 'Failed to save: ',
  },
  loading: 'Loading models and configuration...',
}

export function flattenDictionary(
  record: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(record)) {
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      result[nextKey] = value
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenDictionary(value as Record<string, unknown>, nextKey),
      )
    }
  }
  return result
}
