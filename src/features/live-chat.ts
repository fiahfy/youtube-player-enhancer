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
      return clearInterval(timer)
    }

    const button = document.querySelector<HTMLElement>('#show-hide-button')
    if (!button) {
      return
    }
    if (button.hidden) {
      return
    }

    const renderer = button.querySelector<HTMLElement>('ytd-button-renderer')
    if (!renderer) {
      return
    }

    renderer.click()
  }, 100)
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
