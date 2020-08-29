import { browser } from 'webextension-polyfill-ts'
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

const createButton = (config: ButtonConfig): HTMLButtonElement => {
  const button = document.createElement('button')
  button.classList.add('ytp-button')
  button.title = config.title
  button.disabled = true
  button.onclick = (): void => {
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

const setupControls = (): void => {
  const controls = document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  for (const config of buttonConfigs) {
    if (controls.querySelector(`.${config.className}`)) {
      continue
    }

    const button = createButton(config)
    button.classList.add(config.className)
    controls.append(button)
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

const removeControls = (): void => {
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

const setupControlsLoop = async (): Promise<void> => {
  return new Promise((resolve) => {
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

const setup = async () => {
  if (!isVideoUrl()) {
    return
  }
  settings.seekButtonsEnabled ? await enableControls() : disableControls()
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
  const data = await browser.runtime.sendMessage({
    id: 'contentLoaded',
  })
  settings = data.settings
  await setup()
})
