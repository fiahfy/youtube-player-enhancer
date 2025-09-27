import type { Settings } from '~/models'
import { querySelectorAsync } from '~/utils'

let settings: Settings

const init = async () => {
  if (!settings.autoCloseLiveChatPoll) {
    return
  }

  const button = await querySelectorAsync<HTMLElement>(
    '#action-panel yt-live-chat-button',
  )
  if (!button) {
    return
  }
  button.click()

  const item = await querySelectorAsync<HTMLElement>(
    'tp-yt-iron-dropdown ytd-menu-service-item-renderer:nth-child(2)',
  )
  if (!item) {
    return
  }
  item.click()
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'settings-changed':
      settings = data.settings
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
