import browser from 'webextension-polyfill'
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
const loaded = async (tabId: number, frameId?: number) => {
  await browser.pageAction.setIcon({ tabId, path: icon })
  await browser.pageAction.show(tabId)
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

  await browser.tabs.sendMessage(tabId, {
    id: 'tabStateChanged',
    data: { tabState },
  })
}

const settingsChanged = async () => {
  const settings = await getSettings()
  const tabs = await browser.tabs.query({})
  for (const tab of tabs) {
    try {
      tab.id &&
        (await browser.tabs.sendMessage(tab.id, {
          id: 'settingsChanged',
          data: { settings },
        }))
    } catch (e) {} // eslint-disable-line no-empty
  }
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    const settings = await getSettings()
    browser.tabs.sendMessage(tabId, { id: 'urlChanged', data: { settings } })
  }
})

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id, data } = message
  const { tab, frameId } = sender
  switch (id) {
    case 'loaded':
      return tab?.id && (await loaded(tab.id, frameId))
    case 'iframeLoaded':
      return tab?.id && (await iframeLoaded(tab.id, frameId))
    case 'contentLoaded':
      return tab?.id && (await contentLoaded(tab.id))
    case 'settingsChanged':
      await settingsChanged()
      break
    case 'tabStateChanged': {
      const { name, value } = data
      tab?.id && (await tabStateChanged(tab.id, name, value))
      break
    }
  }
})
