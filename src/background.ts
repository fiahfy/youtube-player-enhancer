import { readyStore } from '~/store'
import icon from '~/assets/icon.png'

type TabState = {
  [name: string]: boolean
}

const initialState: TabState = { forceScrollEnabled: true }
let tabStates: { [tabId: number]: TabState } = {}

const getSettings = async () => {
  const store = await readyStore()
  return JSON.parse(JSON.stringify(store.state.settings))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loaded = async (tabId: number) => {
  await chrome.action.setIcon({ tabId, path: icon })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const iframeLoaded = async (tabId: number, frameId?: number) => {
  //
}

const contentLoaded = async (tabId: number) => {
  const tabState = { ...initialState }
  tabStates = { ...tabStates, [tabId]: tabState }

  const settings = await getSettings()

  return { settings, tabState }
}

const tabStateChanged = async (tabId: number, name: string, value: boolean) => {
  let tabState = tabStates[tabId] ?? { ...initialState }
  tabState = {
    ...tabState,
    [name]: value,
  }
  initialState[name] = tabState[name]
  tabStates = {
    ...tabStates,
    [tabId]: tabState,
  }

  await chrome.tabs.sendMessage(tabId, {
    type: 'tab-state-changed',
    data: { tabState },
  })
}

const settingsChanged = async () => {
  const settings = await getSettings()
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    try {
      tab.id &&
        chrome.tabs.sendMessage(tab.id, {
          type: 'settings-changed',
          data: { settings },
        })
    } catch (e) {} // eslint-disable-line no-empty
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    await chrome.tabs.sendMessage(tabId, { type: 'url-changed' })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, data } = message
  const { tab, frameId } = sender
  switch (type) {
    case 'loaded':
      if (tab?.id) {
        loaded(tab.id).then(() => sendResponse())
        return true
      }
      return
    case 'iframe-loaded':
      if (tab?.id) {
        iframeLoaded(tab.id, frameId).then(() => sendResponse())
        return true
      }
      return
    case 'content-loaded':
      if (tab?.id) {
        contentLoaded(tab.id).then((data) => sendResponse(data))
        return true
      }
      return
    case 'settings-changed':
      settingsChanged().then(() => sendResponse())
      return true
    case 'tab-state-changed': {
      const { name, value } = data
      if (tab?.id) {
        tabStateChanged(tab.id, name, value).then(() => sendResponse())
        return true
      }
      return
    }
  }
})
