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

  let button: HTMLElement | undefined

  try {
    button = await waitUntil(async () => {
      const button = document.querySelector<HTMLElement>('#show-hide-button')
      if (!button) {
        return undefined
      }
      if (button.hidden) {
        return undefined
      }
      return button
    })
  } catch {
    return
  }

  if (!button) {
    return
  }

  const renderer = button.querySelector<HTMLElement>('ytd-button-renderer')
  if (!renderer) {
    return
  }

  renderer.click()
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
