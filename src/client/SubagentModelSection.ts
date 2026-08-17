import * as React from 'react'
import type { SubagentModelConfig } from '../types.ts'
import type {
  ModelProviderGroup,
  ClientPageProps,
  ModelCatalogItem,
} from './types.ts'
import {
  getLocalStore,
  saveLocalStore,
  getSessionRawConfig,
  getSessionEffectiveConfig,
} from './storage.ts'

const e = React.createElement

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/** Localized label for a reasoning-effort id, falling back to the raw id. */
function effortLabel(t: (key: string) => string, effortId: string): string {
  const key = `field.reasoning${capitalize(effortId)}`
  const translated = t(key)
  return translated && !translated.startsWith('field.') ? translated : effortId
}

export function SubagentModelSection({
  api,
  t,
  sessionId,
  sessionTitle,
  onClose,
  onSave,
}: ClientPageProps) {
  const localStore = getLocalStore()
  const initialRaw = getSessionRawConfig(localStore, sessionId)
  const initialEffective = getSessionEffectiveConfig(localStore, sessionId)

  const [saving, setSaving] = React.useState<boolean>(false)
  const [savingDefault, setSavingDefault] = React.useState<boolean>(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')

  const [providers, setProviders] = React.useState<ModelProviderGroup[]>([])
  // Session view starts from the session's raw config (no override => 'default');
  // the global view starts from the actual default config so the radios show
  // whether the global default is inherit or a custom model.
  const [config, setConfig] = React.useState<SubagentModelConfig>(
    sessionId ? initialRaw.config : initialEffective,
  )
  const [defaultConfig, setDefaultConfig] = React.useState<SubagentModelConfig>(
    localStore.default || { mode: 'inherit' },
  )
  const [hasSessionOverride, setHasSessionOverride] = React.useState<boolean>(
    initialRaw.hasOverride,
  )

  const apiRef = React.useRef(api)
  apiRef.current = api

  // Instantly load from local storage whenever sessionId changes, then background sync
  React.useEffect(() => {
    let mounted = true
    const store = getLocalStore()
    const raw = getSessionRawConfig(store, sessionId)
    setConfig(
      sessionId ? raw.config : getSessionEffectiveConfig(store, sessionId),
    )
    setDefaultConfig(store.default || { mode: 'inherit' })
    setHasSessionOverride(raw.hasOverride)
    setSaveSuccessMsg('')
    setError('')

    async function loadData() {
      try {
        // 1. Fetch available models from DSH LLM API
        let groups: ModelProviderGroup[] = []
        try {
          const clientApi = apiRef.current
          if (clientApi?.llm?.models) {
            const modelsRes = await clientApi.llm.models({})
            if (modelsRes?.result?.ok && modelsRes.result.value?.groups) {
              groups = modelsRes.result.value.groups
            }
          }
        } catch {}

        // 2. Fetch current subagent model config from Host HTTP API
        try {
          const url = sessionId
            ? `/api/subagent-model?sessionId=${encodeURIComponent(sessionId)}`
            : '/api/subagent-model'
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            if (mounted && data?.ok) {
              const curStore = getLocalStore()
              if (data.defaultConfig) {
                curStore.default = data.defaultConfig
                setDefaultConfig(data.defaultConfig)
                if (!sessionId) setConfig(data.defaultConfig)
              }
              if (sessionId && data.config?.mode) {
                if (data.config.mode === 'default') {
                  delete curStore.sessions[sessionId]
                } else {
                  curStore.sessions[sessionId] = data.config
                }
              }
              saveLocalStore(curStore)

              // Session view: adopt the server-merged raw config. Global view:
              // config was already set to the server default above — do not
              // reset it back to {mode:'default'}.
              if (sessionId) {
                const updatedRaw = getSessionRawConfig(curStore, sessionId)
                setConfig(updatedRaw.config)
                setHasSessionOverride(updatedRaw.hasOverride)
              }
            }
          }
        } catch {}

        if (mounted && groups.length > 0) {
          setProviders(groups)
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || String(err))
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [sessionId])

  const handleModeChange = (mode: 'default' | 'inherit' | 'custom') => {
    setSaveSuccessMsg('')
    setError('')
    if (mode === 'custom' && !config.provider && providers.length > 0) {
      const firstGroup = providers[0]
      const firstModel = firstGroup.models?.[0]?.id || ''
      setConfig({
        ...config,
        mode: 'custom',
        provider: firstGroup.id,
        model: firstModel,
        reasoningEffort: undefined,
      })
    } else {
      setConfig({
        ...config,
        mode,
      })
    }
  }

  const handleProviderChange = (providerId: string) => {
    setSaveSuccessMsg('')
    setError('')
    const group = providers.find((g) => g.id === providerId)
    const firstModel = group?.models?.[0]?.id || ''
    setConfig({
      ...config,
      provider: providerId,
      model: firstModel,
      reasoningEffort: undefined,
    })
  }

  const handleModelSelectChange = (modelId: string) => {
    setSaveSuccessMsg('')
    setError('')
    const currentGroup = providers.find((g) => g.id === config.provider)
    const selectedModel = currentGroup?.models?.find((m) => m.id === modelId)
    const supportedEfforts = selectedModel?.reasoning?.efforts || []
    const isEffortValid =
      config.reasoningEffort &&
      supportedEfforts.some((e) => e.id === config.reasoningEffort)

    setConfig({
      ...config,
      model: modelId,
      reasoningEffort: isEffortValid ? config.reasoningEffort : undefined,
    })
  }

  const handleReasoningEffortChange = (effortId: string) => {
    setSaveSuccessMsg('')
    setError('')
    setConfig({
      ...config,
      reasoningEffort: effortId.trim() ? effortId.trim() : undefined,
    })
  }

  // Save configuration for this specific session
  const handleSaveSession = async () => {
    try {
      setSaving(true)
      setSaveSuccessMsg('')
      setError('')

      const payloadConfig: SubagentModelConfig = {
        mode: config.mode,
        provider: config.mode === 'custom' ? config.provider : undefined,
        model: config.mode === 'custom' ? config.model : undefined,
        reasoningEffort:
          config.mode === 'custom' ? config.reasoningEffort : undefined,
      }

      if (
        payloadConfig.mode === 'custom' &&
        (!payloadConfig.provider || !payloadConfig.model)
      ) {
        throw new Error(t('field.modelPlaceholder'))
      }

      // 1. Save to localStore
      const store = getLocalStore()
      if (sessionId) {
        if (payloadConfig.mode === 'default') {
          delete store.sessions[sessionId]
        } else {
          store.sessions[sessionId] = payloadConfig
        }
      } else {
        store.default =
          payloadConfig.mode === 'custom' ? payloadConfig : { mode: 'inherit' }
      }
      saveLocalStore(store)

      // 2. Persist to host HTTP API
      try {
        await fetch('/api/subagent-model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            isDefault: !sessionId,
            mode: payloadConfig.mode,
            provider: payloadConfig.provider,
            model: payloadConfig.model,
            reasoningEffort: payloadConfig.reasoningEffort,
            config: payloadConfig,
          }),
        })
      } catch {}

      setConfig(payloadConfig)
      setHasSessionOverride(
        Boolean(sessionId && payloadConfig.mode !== 'default'),
      )
      setSaveSuccessMsg(t('notice.saved'))

      const effective = getSessionEffectiveConfig(store, sessionId)
      onSave?.(effective)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  // Save current selection directly as the global default
  const handleSaveAsDefault = async () => {
    try {
      setSavingDefault(true)
      setSaveSuccessMsg('')
      setError('')

      // Saving "the current selection" as the global default: when the session
      // itself is on "use global default", carry the existing default over
      // instead of collapsing it to 'inherit' and discarding a custom default.
      const store = getLocalStore()
      const source =
        config.mode === 'default'
          ? getSessionEffectiveConfig(store, sessionId)
          : config
      const defaultPayload: SubagentModelConfig = {
        mode: source.mode === 'custom' ? 'custom' : 'inherit',
        provider: source.mode === 'custom' ? source.provider : undefined,
        model: source.mode === 'custom' ? source.model : undefined,
        reasoningEffort:
          source.mode === 'custom' ? source.reasoningEffort : undefined,
      }

      if (
        defaultPayload.mode === 'custom' &&
        (!defaultPayload.provider || !defaultPayload.model)
      ) {
        throw new Error(t('field.modelPlaceholder'))
      }

      // 1. Save to localStore default. "Set as global default" also clears
      //    this session's own override (setting default = clearing the
      //    session setting), so reopening the dialog shows "global default".
      store.default = defaultPayload
      if (sessionId) {
        delete store.sessions[sessionId]
        setConfig({ mode: 'default' })
        setHasSessionOverride(false)
      } else {
        setConfig(defaultPayload)
      }
      saveLocalStore(store)
      setDefaultConfig(defaultPayload)

      // 2. Persist to host HTTP API (with sessionId so the host clears the
      //    session override alongside saving the default)
      try {
        await fetch('/api/subagent-model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            isDefault: true,
            mode: defaultPayload.mode,
            provider: defaultPayload.provider,
            model: defaultPayload.model,
            reasoningEffort: defaultPayload.reasoningEffort,
            config: defaultPayload,
          }),
        })
      } catch {}

      setSaveSuccessMsg(t('notice.savedDefault'))

      const effective = getSessionEffectiveConfig(store, sessionId)
      onSave?.(effective)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setSavingDefault(false)
    }
  }

  const currentProviderGroup = providers.find((g) => g.id === config.provider)
  const availableModels: ModelCatalogItem[] = currentProviderGroup?.models || []
  const selectedModelObj = availableModels.find((m) => m.id === config.model)
  const supportedEfforts = selectedModelObj?.reasoning?.efforts || []

  const displaySessionName = sessionId
    ? sessionTitle
      ? sessionTitle.length > 60
        ? sessionTitle.slice(0, 60) + '...'
        : sessionTitle
      : sessionId.length > 24
        ? sessionId.slice(0, 24) + '...'
        : sessionId
    : ''

  // Three-state view: has this session been configured?
  // no -> global default; yes -> its own custom / inherit choice.
  const effSource = hasSessionOverride ? config : defaultConfig
  const detailText =
    effSource.mode === 'custom'
      ? `${effSource.provider || '?'}/${effSource.model || '?'}${
          effSource.reasoningEffort
            ? ' · ' + effortLabel(t, effSource.reasoningEffort)
            : ''
        }`
      : t('status.inherit')
  const badgeText = !hasSessionOverride
    ? t('status.default')
    : config.mode === 'custom'
      ? t('status.custom')
      : t('status.inherit')
  const badgeClass = !hasSessionOverride
    ? 'badge-default'
    : config.mode === 'custom'
      ? 'badge-custom'
      : 'badge-inherit'

  return e(
    'div',
    { className: 'dsh-sam-page' },
    // Header
    e(
      'div',
      { className: 'dsh-sam-header' },
      e(
        'div',
        { className: 'dsh-sam-header-row' },
        e('h2', { className: 'dsh-sam-title' }, t('title')),
        onClose
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-close-btn',
                'aria-label': t('action.close'),
                onClick: onClose,
              },
              '✕',
            )
          : null,
      ),
      e('p', { className: 'dsh-sam-desc' }, t('desc')),
    ),

    // Scope & Status Card: line 1 = current session title, line 2 = effective
    // model detail (provider/model · reasoning effort), badge = three states.
    e(
      'div',
      { className: 'dsh-sam-status-card' },
      e(
        'div',
        { className: 'dsh-sam-status-left' },
        e(
          'div',
          { className: 'dsh-sam-scope-badge' },
          sessionId
            ? `${t('scope.currentSession')}: ${displaySessionName}`
            : `${t('scope.globalDefault')}`,
        ),
        e('div', { className: 'dsh-sam-status-detail' }, detailText),
      ),
      e(
        'span',
        {
          className: 'dsh-sam-status-badge ' + badgeClass,
        },
        badgeText,
      ),
    ),

    e(
      'div',
      { className: 'dsh-sam-content' },
      e(
        'div',
        { className: 'dsh-sam-mode-list' },
        // Option 1: Global Default (only for sessions)
        sessionId
          ? e(
              'div',
              {
                className: `dsh-sam-mode-item ${config.mode === 'default' ? 'selected' : ''}`,
                onClick: () => handleModeChange('default'),
              },
              e('input', {
                type: 'radio',
                name: 'subagent_mode',
                checked: config.mode === 'default',
                onChange: (evt: any) => {
                  evt.stopPropagation()
                  handleModeChange('default')
                },
              }),
              e(
                'div',
                { className: 'dsh-sam-mode-text' },
                e(
                  'div',
                  { className: 'dsh-sam-mode-title' },
                  t('mode.default.title'),
                ),
                e(
                  'div',
                  { className: 'dsh-sam-mode-desc' },
                  t('mode.default.desc'),
                ),
              ),
            )
          : null,
        // Option 2: Inherit Parent
        e(
          'div',
          {
            className: `dsh-sam-mode-item ${config.mode === 'inherit' ? 'selected' : ''}`,
            onClick: () => handleModeChange('inherit'),
          },
          e('input', {
            type: 'radio',
            name: 'subagent_mode',
            checked: config.mode === 'inherit',
            onChange: (evt: any) => {
              evt.stopPropagation()
              handleModeChange('inherit')
            },
          }),
          e(
            'div',
            { className: 'dsh-sam-mode-text' },
            e(
              'div',
              { className: 'dsh-sam-mode-title' },
              t('mode.inherit.title'),
            ),
            e(
              'div',
              { className: 'dsh-sam-mode-desc' },
              t('mode.inherit.desc'),
            ),
          ),
        ),
        // Option 3: Custom Dedicated Model
        e(
          'div',
          {
            className: `dsh-sam-mode-item ${config.mode === 'custom' ? 'selected' : ''}`,
            onClick: () => handleModeChange('custom'),
          },
          e('input', {
            type: 'radio',
            name: 'subagent_mode',
            checked: config.mode === 'custom',
            onChange: (evt: any) => {
              evt.stopPropagation()
              handleModeChange('custom')
            },
          }),
          e(
            'div',
            { className: 'dsh-sam-mode-text' },
            e(
              'div',
              { className: 'dsh-sam-mode-title' },
              t('mode.custom.title'),
            ),
            e('div', { className: 'dsh-sam-mode-desc' }, t('mode.custom.desc')),
          ),
        ),
      ),

      // Custom Configuration Fields (rendered when custom mode is active)
      config.mode === 'custom'
        ? e(
            'div',
            { className: 'dsh-sam-fields-panel' },
            // Provider field
            e(
              'div',
              { className: 'dsh-sam-field-group' },
              e(
                'label',
                { className: 'dsh-sam-field-label' },
                t('field.provider'),
              ),
              e(
                'select',
                {
                  className: 'dsh-sam-select',
                  value: config.provider || '',
                  onChange: (evt: any) =>
                    handleProviderChange(evt.target.value),
                },
                providers.length === 0
                  ? e('option', { value: '' }, t('field.providerPlaceholder'))
                  : providers.map((p) =>
                      e(
                        'option',
                        { key: p.id, value: p.id },
                        p.name ? `${p.name} (${p.id})` : p.id,
                      ),
                    ),
              ),
            ),

            // Model field
            e(
              'div',
              { className: 'dsh-sam-field-group' },
              e(
                'label',
                { className: 'dsh-sam-field-label' },
                t('field.model'),
              ),
              e(
                'select',
                {
                  className: 'dsh-sam-select',
                  value: config.model || '',
                  onChange: (evt: any) =>
                    handleModelSelectChange(evt.target.value),
                },
                availableModels.length === 0
                  ? e('option', { value: '' }, t('field.modelPlaceholder'))
                  : availableModels.map((m) =>
                      e(
                        'option',
                        { key: m.id, value: m.id },
                        m.name ? `${m.name} (${m.id})` : m.id,
                      ),
                    ),
              ),
            ),

            // Reasoning Effort field (conditionally rendered only if model supports reasoning)
            supportedEfforts.length > 0
              ? e(
                  'div',
                  { className: 'dsh-sam-field-group' },
                  e(
                    'label',
                    { className: 'dsh-sam-field-label' },
                    t('field.reasoningEffort'),
                  ),
                  e(
                    'select',
                    {
                      className: 'dsh-sam-select',
                      value: config.reasoningEffort || '',
                      onChange: (evt: any) =>
                        handleReasoningEffortChange(evt.target.value),
                    },
                    e(
                      'option',
                      { value: '' },
                      t('field.reasoningEffortDefault'),
                    ),
                    supportedEfforts.map((eff) => {
                      const translationKey = `field.reasoning${capitalize(eff.id)}`
                      const translatedLabel = t(translationKey)
                      const displayLabel =
                        translatedLabel && !translatedLabel.startsWith('field.')
                          ? translatedLabel
                          : eff.name || eff.id
                      return e(
                        'option',
                        { key: eff.id, value: eff.id },
                        displayLabel,
                      )
                    }),
                  ),
                )
              : null,
          )
        : null,

      // Notice / Alerts
      saveSuccessMsg
        ? e('div', { className: 'dsh-sam-notice success' }, saveSuccessMsg)
        : null,
      error
        ? e(
            'div',
            { className: 'dsh-sam-notice error' },
            `${t('notice.error')}${error}`,
          )
        : null,

      // Action Buttons: Save Session + Set as Default + Reset
      e(
        'div',
        { className: 'dsh-sam-actions' },
        // Primary Save for session
        sessionId
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn primary',
                disabled: saving || savingDefault,
                onClick: handleSaveSession,
              },
              saving ? t('action.saving') : t('action.saveSession'),
            )
          : e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn primary',
                disabled: saving || savingDefault,
                onClick: handleSaveAsDefault,
              },
              savingDefault
                ? t('action.savingDefault')
                : t('action.saveDefault'),
            ),
        // Set As Default button (available anytime to promote current settings to default)
        sessionId && config.mode !== 'default'
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn default-btn',
                disabled: saving || savingDefault,
                onClick: handleSaveAsDefault,
              },
              savingDefault
                ? t('action.savingDefault')
                : t('action.saveDefault'),
            )
          : null,
        onClose
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn tertiary',
                onClick: onClose,
              },
              t('action.close'),
            )
          : null,
      ),
    ),
  )
}
