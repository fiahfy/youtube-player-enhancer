import type { Settings } from '~/models'
import { isVideoUrl } from '~/utils/url'

const className = 'ype-elapsed-time'
let settings: Settings

const updateRoot = (enabled: boolean) => {
  if (enabled) {
    document.body.classList.add(className)
  } else {
    document.body.classList.remove(className)
  }
}

const init = async () => {
  if (!isVideoUrl()) {
    return
  }
  updateRoot(settings.elapsedTime)
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'url-changed':
      init().then(() => sendResponse())
      return true
    case 'settings-changed':
      settings = data.settings
      init().then(() => sendResponse())
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
