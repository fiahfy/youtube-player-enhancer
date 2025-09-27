import type { Settings } from '~/models'
import { isVideoUrl, querySelectorAsync, waitUntil } from '~/utils'

let settings: Settings

const init = async () => {
  if (!isVideoUrl()) {
    return
  }

  if (!settings.autoShowLiveChat) {
    return
  }

  await waitUntil(async () => {
    const button = await querySelectorAsync<HTMLElement>('#show-hide-button')
    if (!button) {
      return false
    }
    if (button.hidden) {
      return true
    }

    const renderer = await querySelectorAsync<HTMLElement>(
      'ytd-button-renderer',
      { root: button },
    )
    if (!renderer) {
      return false
    }

    // Wait a moment since the click event isn’t working
    await new Promise((resolve) => setTimeout(resolve, 1000))
    renderer.click()
    return false
  })
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
