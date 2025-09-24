import type { Settings } from '~/models'
import { isVideoUrl, querySelectorAsync } from '~/utils'

let settings: Settings

const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName.toLowerCase() !== 'a') {
    return
  }
  const match = target.getAttribute('href')?.match(/&t=(\d+)s(&|$)/)
  if (!match) {
    return
  }
  const video = document.querySelector('video.video-stream')
  if (video instanceof HTMLVideoElement) {
    e.preventDefault()
    e.stopPropagation()
    video.currentTime = Number(match[1])
  }
}

const addEventListeners = async () => {
  const el = await querySelectorAsync<HTMLElement>('ytd-comments')
  el?.addEventListener('click', handleClick, { capture: true })
}

const removeEventListeners = async () => {
  const el = await querySelectorAsync<HTMLElement>('ytd-comments')
  el?.removeEventListener('click', handleClick, { capture: true })
}

const init = async () => {
  if (!isVideoUrl()) {
    return
  }
  if (settings.preventTimestampScroll) {
    await addEventListeners()
  } else {
    await removeEventListeners()
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
      init().then(() => sendResponse())
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
