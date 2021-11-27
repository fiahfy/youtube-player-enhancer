import browser from 'webextension-polyfill'
import Settings from '~/models/settings'
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

const setup = async () => {
  if (!isVideoUrl()) {
    return
  }
  updateRoot(settings.elapsedTime)
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, data } = message
  switch (id) {
    case 'urlChanged':
      settings = data.settings
      return await setup()
    case 'settingsChanged':
      settings = data.settings
      return await setup()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  settings = data.settings
  await setup()
})
