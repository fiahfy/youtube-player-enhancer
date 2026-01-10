import type { Settings } from '~/models'
import { isVideoUrl, waitUntil } from '~/utils'

let settings: Settings

const init = async () => {
  if (!isVideoUrl()) {
    return
  }

  if (!settings.autoShowLiveChat) {
    return
  }

  try {
    await waitUntil(() => {
      const el = document.querySelector<HTMLElement>('#chat')
      if (!el) {
        return false
      }
      const hidden = el.hasAttribute('hide-chat-frame')
      if (!hidden) {
        return false
      }
      const button = document.querySelector<HTMLElement>(
        'yt-video-metadata-carousel-view-model',
      )
      if (!button) {
        return false
      }
      button.click()
      return true
    })
  } catch {
    // noop
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'url-changed':
      init().then(() => sendResponse())
      return true
    case 'settings-changed':
      settings = data.settings
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
