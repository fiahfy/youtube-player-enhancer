import { browser } from 'webextension-polyfill-ts'
import Settings from '~/models/settings'
import downArrow from '~/assets/down-arrow.svg'

const className = 'ype-force-scroll-button'
const interval = 100
let settings: Settings
let enabled: boolean
let timer: number

const updateButton = (): void => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button'
  )
  const button = refIconButton?.parentElement?.querySelector(`.${className}`)
  if (!button) {
    return
  }
  if (enabled) {
    button.classList.add('ype-active-menu-button')
  } else {
    button.classList.remove('ype-active-menu-button')
  }
}

const addButton = () => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button'
  )
  if (refIconButton?.parentElement?.querySelector(`.${className}`)) {
    return
  }

  const icon = document.createElement('yt-icon')
  icon.classList.add('yt-live-chat-header-renderer', 'style-scope')
  const iconButton = document.createElement('yt-icon-button')
  iconButton.id = 'overflow'
  iconButton.classList.add(
    'yt-live-chat-header-renderer',
    'style-scope',
    'ype-menu-button'
  )
  iconButton.title = 'Enable Force Scroll'
  iconButton.onclick = () => {
    browser.runtime.sendMessage({
      id: 'tabStateChanged',
      data: { name: 'forceScrollEnabled', value: !enabled },
    })
  }
  iconButton.append(icon)
  iconButton.classList.add(className)

  refIconButton?.parentElement?.insertBefore(iconButton, refIconButton)

  // insert svg after wrapper button appended
  icon.innerHTML = downArrow

  updateButton()
}

const removeButton = (): void => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button'
  )
  const button = refIconButton?.parentElement?.querySelector(`.${className}`)
  button && button.remove()
}

const setupTimer = () => {
  clearInterval(timer)

  if (enabled) {
    const scrollToBottom = () => {
      const hovered = !!document.querySelector('#chat:hover')
      if (hovered) {
        return
      }
      const scroller = document.querySelector('#item-scroller')
      if (scroller) {
        scroller.scrollTop = scroller.scrollHeight
      }
    }
    scrollToBottom()
    timer = window.setInterval(scrollToBottom, interval)
  }
}

const setup = () => {
  if (settings.forceScrollButtonEnabled) {
    addButton()
    setupTimer()
  } else {
    removeButton()
  }
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, data } = message
  switch (id) {
    case 'settingsChanged':
      settings = data.settings
      setup()
      break
    case 'tabStateChanged':
      enabled = data.tabState.forceScrollEnabled
      updateButton()
      setupTimer()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  settings = data.settings
  enabled = data.tabState.forceScrollEnabled
  setup()
})
