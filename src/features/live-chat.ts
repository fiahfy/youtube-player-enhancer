import type { Settings } from '~/models'
import { isVideoUrl, querySelectorAsync } from '~/utils'

let settings: Settings

const init = async () => {
  if (!isVideoUrl()) {
    return
  }

  if (!settings.autoShowLiveChat) {
    return
  }

  const button = await querySelectorAsync<HTMLElement>(
    'yt-video-metadata-carousel-view-model',
  )
  if (button) {
    button.click()
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
