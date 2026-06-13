import type { Settings } from '~/models'
import { persistConfig } from '~/store'
import { initialState as initialSettings } from '~/store/settings'

interface TabState {
  enableFollowLatest: boolean
}

const initialTabState = { enableFollowLatest: true }
let tabStates: { [tabId: number]: TabState } = {}

const getSettings = async () => {
  try {
    const key = `persist:${persistConfig.key}`
    const json = (await chrome.storage.local.get(key))[key]
    if (typeof json !== 'string') {
      return initialSettings
    }
    const rootState = JSON.parse(json)
    return JSON.parse(rootState.settings)
  } catch {
    return initialSettings
  }
}

const contentLoaded = async (tabId: number) => {
  const settings = await getSettings()

  const tabState = { ...initialTabState }
  tabStates = { ...tabStates, [tabId]: tabState }

  return { settings, tabState }
}

const settingsChanged = async (settings: Settings) => {
  const tabs = await chrome.tabs.query({ url: 'https://www.youtube.com/*' })
  for (const tab of tabs) {
    try {
      tab.id &&
        chrome.tabs.sendMessage(tab.id, {
          type: 'settings-changed',
          data: { settings },
        })
    } catch {
      // noop
    }
  }
}

const toggleEnableFollowLatest = async (tabId: number) => {
  const tabState = tabStates[tabId] ?? initialTabState

  const enableFollowLatest = !tabState.enableFollowLatest

  initialTabState.enableFollowLatest = enableFollowLatest

  const newTabState = { ...tabState, enableFollowLatest }

  tabStates = {
    ...tabStates,
    [tabId]: newTabState,
  }

  await chrome.tabs.sendMessage(tabId, {
    type: 'tab-state-changed',
    data: { tabState: newTabState },
  })
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    await chrome.tabs.sendMessage(tabId, { type: 'url-changed' })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, data } = message
  const { tab } = sender
  switch (type) {
    case 'content-loaded':
      if (tab?.id) {
        contentLoaded(tab.id).then((data) => sendResponse(data))
        return true
      }
      return
    case 'settings-changed':
      settingsChanged(data.settings).then(() => sendResponse())
      return true
    case 'follow-latest-button-clicked':
      if (tab?.id) {
        toggleEnableFollowLatest(tab.id).then(() => sendResponse())
        return true
      }
      return
  }
})
