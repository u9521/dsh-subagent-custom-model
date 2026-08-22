import * as React from 'react'
import {
  IconRefreshOutline16,
  IconSearchOutline16,
  IconSkillOutline16,
  IconCloseOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  SkillItem,
  SkillsSettingsProps,
  SessionSettingsConfig,
} from './types.ts'
import {
  getLocalSessionSettingsStore,
  saveLocalSessionSettingsStore,
} from './storage.ts'

const e = React.createElement

export function getSkillSourceMeta(
  skill: { source?: string; isRuntime?: boolean } | null | undefined,
  t: (key: string, params?: any) => string,
): { sourceClass: string; sourceLabel: string } {
  if (!skill) {
    return {
      sourceClass: 'source-user',
      sourceLabel: t('sessionSettings.skills.sourceUser') || '用户技能',
    }
  }
  const isRuntime = Boolean(skill.isRuntime)
  const source = (skill.source || '').toLowerCase()
  if (isRuntime) {
    return {
      sourceClass: 'source-runtime',
      sourceLabel:
        t('sessionSettings.skills.sourceRuntime') ||
        t('sessionSettings.skills.runtimeBadge') ||
        '运行时预设',
    }
  }
  if (source.includes('project')) {
    return {
      sourceClass: 'source-project',
      sourceLabel: t('sessionSettings.skills.sourceProject') || '项目技能',
    }
  }
  if (source.includes('user')) {
    return {
      sourceClass: 'source-user',
      sourceLabel: t('sessionSettings.skills.sourceUser') || '用户技能',
    }
  }
  if (source === 'bundled') {
    return {
      sourceClass: 'source-bundled',
      sourceLabel: t('sessionSettings.skills.sourceBundled') || '内置技能',
    }
  }
  return {
    sourceClass: 'source-runtime',
    sourceLabel:
      t('sessionSettings.skills.sourceRuntime') ||
      t('sessionSettings.skills.runtimeBadge') ||
      '运行时预设',
  }
}

export function SkillsSettingsTab({
  api: _api,
  t,
  close: _close,
}: SkillsSettingsProps) {
  const localStore = getLocalSessionSettingsStore()
  const [skills, setSkills] = React.useState<SkillItem[]>([])
  const [defaultDisabledModelList, setDefaultDisabledModelList] =
    React.useState<string[]>(
      localStore.default?.skills?.disabledModelSkills ||
        localStore.default?.skills?.disabledSkills ||
        [],
    )
  const [defaultDisabledUserList, setDefaultDisabledUserList] = React.useState<
    string[]
  >(localStore.default?.skills?.disabledUserSkills || [])

  const [loading, setLoading] = React.useState<boolean>(true)
  const [saving, setSaving] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [successMsg, setSuccessMsg] = React.useState<string>('')

  // Modal State
  const [selectedSkillForModal, setSelectedSkillForModal] =
    React.useState<SkillItem | null>(null)
  const [skillsContentMap, setSkillsContentMap] = React.useState<
    Record<string, SkillItem>
  >({})
  const [skillsLoadingMap, setSkillsLoadingMap] = React.useState<
    Record<string, boolean>
  >({})

  const defaultDisabledModelSet = React.useMemo(
    () => new Set(defaultDisabledModelList),
    [defaultDisabledModelList],
  )
  const defaultDisabledUserSet = React.useMemo(
    () => new Set(defaultDisabledUserList),
    [defaultDisabledUserList],
  )

  const nonRuntimeSkills = React.useMemo(
    () => skills.filter((s) => !s.isRuntime),
    [skills],
  )

  const enabledCount = React.useMemo(
    () =>
      nonRuntimeSkills.filter((s) => !defaultDisabledModelSet.has(s.name))
        .length,
    [nonRuntimeSkills, defaultDisabledModelSet],
  )

  const loadSkills = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/session-settings')
      if (res.ok) {
        const data = await res.json()
        if (data?.ok) {
          if (Array.isArray(data.availableSkills)) {
            setSkills(data.availableSkills)
          }
          if (data.defaultConfig?.skills) {
            const mList =
              data.defaultConfig.skills.disabledModelSkills ||
              data.defaultConfig.skills.disabledSkills ||
              []
            const uList = data.defaultConfig.skills.disabledUserSkills || []
            setDefaultDisabledModelList(mList)
            setDefaultDisabledUserList(uList)
          }
          const freshStore = getLocalSessionSettingsStore()
          if (data.defaultConfig) {
            freshStore.default = data.defaultConfig
            saveLocalSessionSettingsStore(freshStore)
          }
        }
      } else {
        const data = await res.json().catch(() => ({}))
        setError(
          t('notices.saveError') + ' ' + (data?.error || `HTTP ${res.status}`),
        )
      }
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadSkills()
  }, [])

  const handleToggleModelInvocable = (skillName: string) => {
    setSuccessMsg('')
    setError('')
    setDefaultDisabledModelList((prev) =>
      prev.includes(skillName)
        ? prev.filter((n) => n !== skillName)
        : [...prev, skillName],
    )
  }

  const handleToggleUserInvocable = (skillName: string) => {
    setSuccessMsg('')
    setError('')
    setDefaultDisabledUserList((prev) =>
      prev.includes(skillName)
        ? prev.filter((n) => n !== skillName)
        : [...prev, skillName],
    )
  }

  const handleSaveDefault = async () => {
    setSaving(true)
    setError('')
    setSuccessMsg('')

    const curStore = getLocalSessionSettingsStore()
    const payloadConfig: SessionSettingsConfig = {
      subagentModel: curStore.default.subagentModel || { mode: 'inherit' },
      mcp: curStore.default.mcp || { mode: 'default', enabledServerIds: [] },
      skills: {
        mode: 'default',
        disabledSkills: defaultDisabledModelList,
        disabledModelSkills: defaultDisabledModelList,
        disabledUserSkills: defaultDisabledUserList,
      },
    }

    try {
      const res = await fetch('/api/session-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: payloadConfig,
          isDefault: true,
        }),
      })

      const data = await res.json()
      if (res.ok && data?.ok) {
        curStore.default = payloadConfig
        saveLocalSessionSettingsStore(curStore)
        setSuccessMsg(t('notices.saved'))
        setTimeout(() => setSuccessMsg(''), 3500)
      } else {
        setError(t('notices.saveError') + (data?.error || 'Unknown error'))
      }
    } catch (err: any) {
      setError(t('notices.saveError') + (err?.message || String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleOpenSkillModal = async (skill: SkillItem) => {
    setSelectedSkillForModal(skill)
    const skillName = skill.name
    if (!skillsContentMap[skillName] && !skill.content) {
      setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: true }))
      try {
        const res = await fetch(
          `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}`,
        )
        if (res.ok) {
          const data = await res.json()
          if (data?.ok && data.skill) {
            setSkillsContentMap((prev) => ({
              ...prev,
              [skillName]: data.skill,
            }))
          } else {
            setSkillsContentMap((prev) => ({
              ...prev,
              [skillName]: {
                ...skill,
                content: '（暂未获取到该技能的详细指令内容）',
              },
            }))
          }
        } else {
          setSkillsContentMap((prev) => ({
            ...prev,
            [skillName]: {
              ...skill,
              content: '（加载技能详细指令失败）',
            },
          }))
        }
      } catch (err: any) {
        setSkillsContentMap((prev) => ({
          ...prev,
          [skillName]: {
            ...skill,
            content: `（加载出错: ${err?.message || String(err)}）`,
          },
        }))
      } finally {
        setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: false }))
      }
    }
  }

  const filteredSkills = skills.filter((s) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.source || '').toLowerCase().includes(q) ||
      (s.provider || '').toLowerCase().includes(q)
    )
  })

  // Modal active item details
  const modalSkill = selectedSkillForModal
  const modalDetail = modalSkill
    ? skillsContentMap[modalSkill.name] || modalSkill
    : null
  const modalIsRuntime = modalSkill ? Boolean(modalSkill.isRuntime) : false
  const modalIsModelDisabled = modalSkill
    ? defaultDisabledModelSet.has(modalSkill.name)
    : false
  const modalIsUserDisabled = modalSkill
    ? defaultDisabledUserSet.has(modalSkill.name)
    : false
  const modalIsLoadingContent = modalSkill
    ? Boolean(skillsLoadingMap[modalSkill.name])
    : false

  const { sourceClass: modalSourceClass, sourceLabel: modalSourceLabel } =
    getSkillSourceMeta(modalSkill, t)

  return e(
    'div',
    { className: 'dsh-sam-page dsh-mcp-settings-page' },

    // Notice alert banners
    error ? e('div', { className: 'dsh-sam-notice error' }, error) : null,
    successMsg
      ? e('div', { className: 'dsh-sam-notice success' }, successMsg)
      : null,

    // Page Header
    e(
      'div',
      { className: 'dsh-mcp-header-card' },
      e(
        'div',
        { className: 'dsh-mcp-header-title-row' },
        e(
          'div',
          null,
          e(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            e(IconSkillOutline16, { size: 18 }),
            e(
              'h2',
              { className: 'dsh-mcp-page-title' },
              t('title') || '技能管理',
            ),
          ),
          e(
            'p',
            { className: 'dsh-mcp-page-desc' },
            t('desc') ||
              '配置所有新会话默认生效的 Skill 启用/禁用规则。支持分别独立管控模型的 tool-skill 工具调用与用户的 /快捷指令。',
          ),
        ),
        e(
          'div',
          { className: 'dsh-mcp-header-actions' },
          e(
            'button',
            {
              type: 'button',
              className: 'dsh-sam-btn secondary',
              title: t('sessionSettings.skills.refresh') || '刷新技能',
              onClick: loadSkills,
            },
            e(IconRefreshOutline16, { size: 14 }),
          ),
          e(
            'button',
            {
              type: 'button',
              className: 'dsh-sam-btn primary',
              disabled: saving,
              onClick: handleSaveDefault,
            },
            saving
              ? t('notices.saving')
              : t('actions.saveSettings') || '保存设置',
          ),
        ),
      ),
    ),

    // Content Body
    loading
      ? e(
          'div',
          { className: 'dsh-mcp-loading-card' },
          e('p', null, t('sessionSettings.skills.refreshing')),
        )
      : e(
          'div',
          { className: 'dsh-mcp-body-wrap' },

          // Toolbar
          e(
            'div',
            { className: 'dsh-mcp-tools-toolbar' },
            e(
              'div',
              { className: 'dsh-mcp-tools-search-box' },
              e(
                'div',
                { className: 'dsh-mcp-search-wrap' },
                e(IconSearchOutline16, {
                  size: 14,
                  className: 'dsh-mcp-search-icon',
                }),
                e('input', {
                  type: 'text',
                  className: 'dsh-mcp-search-input',
                  placeholder: t('sessionSettings.skills.searchPlaceholder'),
                  value: search,
                  onChange: (evt: any) => setSearch(evt.target.value),
                }),
              ),
            ),
          ),

          // Stats Bar
          e(
            'div',
            { className: 'dsh-mcp-tools-stats-bar' },
            e(
              'span',
              null,
              t('sessionSettings.skills.effectiveInfoDefault', {
                total: nonRuntimeSkills.length,
                enabled: enabledCount,
              }),
            ),
            search.trim()
              ? e(
                  'span',
                  null,
                  `匹配到 ${filteredSkills.length} / ${skills.length} 个技能`,
                )
              : null,
          ),

          // Skill list cards
          filteredSkills.length === 0
            ? e(
                'div',
                { className: 'dsh-mcp-empty-card' },
                e(
                  'p',
                  { className: 'dsh-mcp-empty-text' },
                  t('sessionSettings.skills.noMatch'),
                ),
              )
            : e(
                'div',
                { className: 'dsh-session-skills-list' },
                filteredSkills.map((skill) => {
                  const isModelDisabled = defaultDisabledModelSet.has(
                    skill.name,
                  )
                  const isUserDisabled = defaultDisabledUserSet.has(skill.name)
                  const isRuntime = Boolean(skill.isRuntime)

                  const { sourceClass, sourceLabel } = getSkillSourceMeta(
                    skill,
                    t,
                  )

                  return e(
                    'div',
                    {
                      key: skill.name,
                      className: `dsh-session-skill-item ${!isModelDisabled ? 'active' : 'disabled'}`,
                      onClick: () => handleOpenSkillModal(skill),
                      style: { cursor: 'pointer' },
                    },
                    e(
                      'div',
                      { className: 'dsh-session-skill-main' },
                      e(
                        'div',
                        { className: 'dsh-session-skill-info' },
                        e(
                          'div',
                          { className: 'dsh-session-skill-row1' },
                          e(
                            'div',
                            { className: 'dsh-session-skill-title-wrap' },
                            e(IconSkillOutline16, { size: 14 }),
                            e(
                              'span',
                              { className: 'dsh-session-skill-name' },
                              skill.name,
                            ),
                            e(
                              'span',
                              {
                                className: `dsh-skill-badge ${sourceClass}`,
                              },
                              sourceLabel,
                            ),
                            isRuntime
                              ? null
                              : e(
                                  'span',
                                  {
                                    className: `dsh-skill-badge ${!isModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                                  },
                                  !isModelDisabled
                                    ? t(
                                        'sessionSettings.skills.modelInvocableEnabled',
                                      ) || '模型调用: 开启'
                                    : t(
                                        'sessionSettings.skills.modelInvocableDisabled',
                                      ) || '模型调用: 禁用',
                                ),
                            isRuntime
                              ? null
                              : e(
                                  'span',
                                  {
                                    className: `dsh-skill-badge ${!isUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                                  },
                                  !isUserDisabled
                                    ? t(
                                        'sessionSettings.skills.userInvocableEnabled',
                                      ) || '快捷指令: 开启'
                                    : t(
                                        'sessionSettings.skills.userInvocableDisabled',
                                      ) || '快捷指令: 禁用',
                                ),
                          ),
                        ),
                        skill.description
                          ? e(
                              'p',
                              { className: 'dsh-session-skill-desc' },
                              skill.description,
                            )
                          : null,
                      ),
                      e(
                        'div',
                        { className: 'dsh-skill-actions' },
                        e(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-skill-config-btn',
                            onClick: (evt: any) => {
                              evt.stopPropagation()
                              handleOpenSkillModal(skill)
                            },
                          },
                          t('sessionSettings.skills.openModalBtn') ||
                            '配置 / 详情',
                        ),
                      ),
                    ),
                  )
                }),
              ),
        ),

    // Standalone Skill Configuration & Details Modal
    modalSkill && modalDetail
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) {
                setSelectedSkillForModal(null)
              }
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-skill-modal' },
            // Modal Header
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e(
                'div',
                { className: 'dsh-mcp-tools-header-info' },
                e(
                  'h3',
                  {
                    className: 'dsh-sam-title',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                  },
                  e(IconSkillOutline16, { size: 18 }),
                  modalSkill.name,
                ),
                e(
                  'div',
                  { className: 'dsh-skill-modal-header-meta' },
                  e(
                    'span',
                    { className: `dsh-skill-badge ${modalSourceClass}` },
                    modalSourceLabel,
                  ),
                  !modalIsRuntime
                    ? e(
                        'span',
                        {
                          className: `dsh-skill-badge ${!modalIsModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                        },
                        !modalIsModelDisabled
                          ? t('sessionSettings.skills.modelInvocableEnabled') ||
                              '模型调用: 开启'
                          : t(
                              'sessionSettings.skills.modelInvocableDisabled',
                            ) || '模型调用: 禁用',
                      )
                    : null,
                  !modalIsRuntime
                    ? e(
                        'span',
                        {
                          className: `dsh-skill-badge ${!modalIsUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                        },
                        !modalIsUserDisabled
                          ? t('sessionSettings.skills.userInvocableEnabled') ||
                              '快捷指令: 开启'
                          : t('sessionSettings.skills.userInvocableDisabled') ||
                              '快捷指令: 禁用',
                      )
                    : null,
                ),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setSelectedSkillForModal(null),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),

            // Modal Body
            e(
              'div',
              { className: 'dsh-skill-modal-body' },

              // Description
              modalSkill.description
                ? e(
                    'p',
                    { className: 'dsh-skill-modal-desc' },
                    modalSkill.description,
                  )
                : null,

              // Runtime Note
              modalIsRuntime
                ? e(
                    'div',
                    { className: 'dsh-skill-runtime-note' },
                    t('sessionSettings.skills.runtimeNotice'),
                  )
                : null,

              // Path & When to use
              modalDetail.path
                ? e(
                    'div',
                    { className: 'dsh-skill-detail-meta' },
                    e(
                      'span',
                      null,
                      t('sessionSettings.skills.pathLabel'),
                      e(
                        'code',
                        { className: 'dsh-skill-detail-path' },
                        modalDetail.path,
                      ),
                    ),
                  )
                : null,
              modalDetail.whenToUse
                ? e(
                    'div',
                    { className: 'dsh-skill-detail-meta' },
                    e(
                      'span',
                      null,
                      t('sessionSettings.skills.whenToUseLabel'),
                      modalDetail.whenToUse,
                    ),
                  )
                : null,

              // Section 1: Invocation Permissions
              e(
                'div',
                { className: 'dsh-skill-modal-section' },
                e(
                  'h4',
                  { className: 'dsh-skill-modal-section-title' },
                  t('sessionSettings.skills.rulesSectionTitle') ||
                    '调用权限管控',
                ),
                !modalIsRuntime
                  ? e(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        },
                      },
                      // Switch 1: Model Invocable
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-card mini ${!modalIsModelDisabled ? 'active' : ''}`,
                          onClick: () =>
                            handleToggleModelInvocable(modalSkill.name),
                          style: { cursor: 'pointer' },
                        },
                        e(
                          'div',
                          { className: 'dsh-mcp-switch-text' },
                          e(
                            'span',
                            { className: 'dsh-mcp-switch-title' },
                            t('sessionSettings.skills.modelInvocableTitle'),
                          ),
                          e(
                            'span',
                            { className: 'dsh-mcp-switch-desc' },
                            t('sessionSettings.skills.modelInvocableDesc'),
                          ),
                        ),
                        e(
                          'div',
                          {
                            className: `dsh-mcp-switch-btn ${!modalIsModelDisabled ? 'active' : ''}`,
                          },
                          e('span', { className: 'dsh-mcp-switch-thumb' }),
                        ),
                      ),
                      // Switch 2: User Invocable
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-card mini ${!modalIsUserDisabled ? 'active' : ''}`,
                          onClick: () =>
                            handleToggleUserInvocable(modalSkill.name),
                          style: { cursor: 'pointer' },
                        },
                        e(
                          'div',
                          { className: 'dsh-mcp-switch-text' },
                          e(
                            'span',
                            { className: 'dsh-mcp-switch-title' },
                            t('sessionSettings.skills.userInvocableTitle'),
                          ),
                          e(
                            'span',
                            { className: 'dsh-mcp-switch-desc' },
                            t('sessionSettings.skills.userInvocableDesc'),
                          ),
                        ),
                        e(
                          'div',
                          {
                            className: `dsh-mcp-switch-btn ${!modalIsUserDisabled ? 'active' : ''}`,
                          },
                          e('span', { className: 'dsh-mcp-switch-thumb' }),
                        ),
                      ),
                    )
                  : null,
              ),

              // Section 2: Instructions & Rules
              e(
                'div',
                { className: 'dsh-skill-modal-section' },
                e(
                  'h4',
                  { className: 'dsh-skill-modal-section-title' },
                  t('sessionSettings.skills.instructionsSectionTitle') ||
                    '指令与规则',
                ),
                modalIsLoadingContent
                  ? e(
                      'div',
                      { className: 'dsh-sam-notice info' },
                      t('sessionSettings.skills.loadingContent'),
                    )
                  : e(
                      'pre',
                      { className: 'dsh-skill-content-block' },
                      modalDetail.content ||
                        t('sessionSettings.skills.noInstructions'),
                    ),
              ),
            ),

            // Modal Footer
            e(
              'div',
              { className: 'dsh-sam-actions dsh-mcp-modal-footer' },
              e('div', { className: 'dsh-mcp-modal-footer-left' }),
              e(
                'div',
                { className: 'dsh-mcp-modal-footer-right' },
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn primary',
                    onClick: () => setSelectedSkillForModal(null),
                  },
                  t('sessionSettings.skills.modalDoneBtn') || '完成',
                ),
              ),
            ),
          ),
        )
      : null,
  )
}
