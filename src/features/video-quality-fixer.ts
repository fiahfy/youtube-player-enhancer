import { browser } from 'webextension-polyfill-ts'
import Settings from '~/models/settings'
import { isVideoUrl } from '~/utils/url'

const className = 'ype-video-quality-fixing'
const interval = 100
const timeout = 3000
let settings: Settings
let timer = -1

const getQualityMenuItem = (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const expire = Date.now() + timeout
    const timer = window.setInterval(() => {
      const menu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:last-child'
      ) as HTMLElement | null
      const text = menu?.textContent ?? ''
      if (text.match(/\d+p/)) {
        window.clearInterval(timer)
        resolve(menu)
      } else if (Date.now() > expire) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

const getHighestQualityMenuItem = (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const expire = Date.now() + timeout
    const timer = window.setInterval(() => {
      const menu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:first-child'
      ) as HTMLElement | null
      const text = menu?.textContent ?? ''
      if (text.match(/\d+p/)) {
        window.clearInterval(timer)
        resolve(menu)
      } else if (Date.now() > expire) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

const fixQuality = async (): Promise<boolean> => {
  try {
    document.body.classList.add(className)

    const button = document.querySelector(
      '.ytp-settings-button'
    ) as HTMLElement | null
    if (!button) {
      throw new Error('Settings button not found')
    }
    button.click()

    const menu = await getQualityMenuItem()
    if (!menu) {
      throw new Error('Menu not found')
    }
    menu.click()

    const submenu = await getHighestQualityMenuItem()
    if (!submenu) {
      throw new Error('Submenu not found')
    }
    submenu.click()
    return true
  } catch (e) {
    return false
  } finally {
    document.body.classList.remove(className)
  }
}

const fixQualityLoop = async (): Promise<void> => {
  return new Promise((resolve) => {
    const video = document.querySelector('video.html5-main-video')
    if (video) {
      video.removeEventListener('loadedmetadata', fixQualityLoop)
    }

    if (timer) {
      window.clearTimeout(timer)
    }

    const expire = Date.now() + timeout
    const callback = async (): Promise<void> => {
      if (Date.now() > expire) {
        window.clearTimeout(timer)
        resolve()
        return
      }
      const result = await fixQuality()
      if (result) {
        window.clearTimeout(timer)
        resolve()
        return
      }
      timer = window.setTimeout(callback)
    }
    timer = window.setTimeout(callback, interval)
  })
}

const setup = async (): Promise<void> => {
  if (!isVideoUrl()) {
    return
  }
  if (!settings.videoQualityFixed) {
    return
  }

  await fixQualityLoop()

  const video = document.querySelector(
    'video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', fixQualityLoop)
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, data } = message
  switch (id) {
    case 'urlChanged':
      settings = data.settings
      return await setup()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  settings = data.settings
  await setup()
})
