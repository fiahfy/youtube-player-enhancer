import type { Settings } from '~/models'
import { isVideoUrl } from '~/utils'

let settings: Settings
let timer: number

const init = async () => {
  if (!isVideoUrl()) {
    return
  }

  if (!settings.autoShowLiveChat) {
    return
  }

  clearInterval(timer)

  const expireTime = Date.now() + 3000
  timer = setInterval(() => {
    if (Date.now() > expireTime) {
      return
    }

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
  }, 500)
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
