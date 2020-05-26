import { browser } from 'webextension-polyfill-ts'
import Settings from '~/models/settings'
import { isVideoUrl } from '~/utils/url'

let settings: Settings

const handleClick = (e: MouseEvent, target?: HTMLElement) => {
  const currentTarget = (target ?? e.target) as HTMLElement
  if (currentTarget.tagName.toLowerCase() === 'a') {
    const match = currentTarget.getAttribute('href')?.match(/&t=(\d+)s$/)
    if (match) {
      const video = document.querySelector('video.video-stream')
      if (video instanceof HTMLVideoElement) {
        e.preventDefault()
        e.stopPropagation()
        video.currentTime = Number(match[1])
      }
    }
  } else if (!currentTarget.parentElement) {
    // end
  } else {
    handleClick(e, currentTarget.parentElement)
  }
}

const addEventListeners = () => {
  const el = document.querySelector('ytd-comments') as HTMLElement
  el?.addEventListener('click', handleClick)
}

const removeEventListeners = () => {
  const el = document.querySelector('ytd-comments') as HTMLElement
  el?.removeEventListener('click', handleClick)
}

const setup = async () => {
  if (!isVideoUrl()) {
    return
  }
  settings.timestampAnchor ? addEventListeners() : removeEventListeners()
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
