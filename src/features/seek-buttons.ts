import Settings from '~/models/settings'
import { isVideoUrl } from '~/utils/url'
import forward from '~/assets/forward.svg'
import replay from '~/assets/replay.svg'

type ButtonConfig = {
  title: string
  className: string
  svg: string
  key: string
  code: string
  keyCode: number
}

const buttonConfigs: ButtonConfig[] = [
  {
    title: 'Seek backward 5s（←）',
    className: 'ype-backward-button',
    svg: replay,
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
  },
  {
    title: 'Seek forward 5s（→）',
    className: 'ype-forward-button',
    svg: forward,
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
  },
]

const interval = 100
const timeout = 3000

let settings: Settings
let timer = -1

const createButton = (config: ButtonConfig) => {
  const button = document.createElement('button')
  button.classList.add('ytp-button')
  button.title = config.title
  button.disabled = true
  button.onclick = () => {
    const e = new KeyboardEvent('keydown', {
      bubbles: true,
      key: config.key,
      code: config.code,
      keyCode: config.keyCode,
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    document.documentElement.dispatchEvent(e)
  }
  button.innerHTML = config.svg

  const svg = button.querySelector('svg')
  if (svg) {
    svg.setAttribute('viewBox', '-8 -8 40 40')
    svg.style.fill = 'white'
  }

  return button
}

const setupControls = () => {
  const volumeArea = document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-volume-area'
  )
  if (!volumeArea || !volumeArea.parentElement) {
    return
  }

  for (const config of buttonConfigs) {
    if (volumeArea.parentElement.querySelector(`.${config.className}`)) {
      continue
    }

    const button = createButton(config)
    button.classList.add(config.className)
    volumeArea.parentElement.insertBefore(button, volumeArea)
  }

  const bar = document.querySelector(
    '.ytp-chrome-bottom .ytp-progress-bar-container'
  )
  if (!bar) {
    return
  }

  const disabled = bar.getAttribute('aria-disabled') === 'true'

  for (const config of buttonConfigs) {
    const button = document.querySelector(
      `.${config.className}`
    ) as HTMLButtonElement | null
    button && (button.disabled = disabled)
  }
}

const removeControls = () => {
  const controls = document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  for (const config of buttonConfigs) {
    const button = controls.querySelector(`.${config.className}`)
    button && button.remove()
  }
}

const setupControlsLoop = async () => {
  return new Promise<void>((resolve) => {
    const video = document.querySelector(
      'ytd-watch-flexy video.html5-main-video'
    )
    if (video) {
      video.removeEventListener('loadedmetadata', setupControlsLoop)
    }

    clearInterval(timer)

    const expire = Date.now() + timeout
    timer = window.setInterval(() => {
      if (Date.now() > expire) {
        clearInterval(timer)
        resolve()
        return
      }
      setupControls()
    }, interval)
  })
}

const disableControls = () => {
  const video = document.querySelector('ytd-watch-flexy video.html5-main-video')
  if (video) {
    video.removeEventListener('loadedmetadata', setupControlsLoop)
  }
  clearInterval(timer)
  removeControls()
}

const enableControls = async () => {
  await setupControlsLoop()

  const video = document.querySelector(
    'ytd-watch-flexy video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', setupControlsLoop)
}

const init = async () => {
  if (!isVideoUrl()) {
    return
  }
  settings.seekButtonsEnabled ? await enableControls() : disableControls()
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

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.runtime.sendMessage({ type: 'content-loaded' })
  settings = data.settings
  await init()
})
