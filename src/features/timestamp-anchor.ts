import type { Settings } from '~/models'
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
  const el = document.querySelector<HTMLElement>('ytd-comments')
  el?.addEventListener('click', handleClick)
}

const removeEventListeners = () => {
  const el = document.querySelector<HTMLElement>('ytd-comments')
  el?.removeEventListener('click', handleClick)
}

const init = async () => {
  if (!isVideoUrl()) {
    return
  }
  settings.timestampAnchor ? addEventListeners() : removeEventListeners()
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
