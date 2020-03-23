import { browser } from 'webextension-polyfill-ts'
import { readyStore } from '~/store'
import iconOn from '~/assets/icon-on.png'
import inject from '~/assets/inject.css'

type TabState = {
  [name: string]: boolean
}

const initialState: TabState = { forceScrollEnabled: true }
let tabStates: { [tabId: number]: TabState } = {}

const getSettings = async () => {
  const store = await readyStore()
  return JSON.parse(JSON.stringify(store.state.settings))
}

const contentLoaded = async (tabId?: number, frameId?: number) => {
  if (!tabId) {
    return
  }

  const tabState = { ...initialState }
  tabStates = { ...tabStates, [tabId]: tabState }

  const settings = await getSettings()

  await browser.pageAction.setIcon({ tabId, path: iconOn })
  await browser.pageAction.show(tabId)
  await browser.tabs.insertCSS(tabId, { frameId, file: inject })

  return { settings, tabState }
}

const updateTabState = async (tabId: number, name: string, value: boolean) => {
  let tabState = tabStates[tabId] ?? { ...initialState }
  tabState = {
    ...tabState,
    [name]: value
  }
  initialState[name] = tabState[name]
  tabStates = {
    ...tabStates,
    [tabId]: tabState
  }

  await browser.tabs.sendMessage(tabId, {
    id: 'tabStateChanged',
    data: { tabState }
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
          data: { settings }
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
    case 'contentLoaded':
      return await contentLoaded(tab?.id, frameId)
    case 'settingsChanged':
      await settingsChanged()
      break
    case 'updateTabState': {
      const { name, value } = data
      tab?.id && (await updateTabState(tab.id, name, value))
      break
    }
  }
})
