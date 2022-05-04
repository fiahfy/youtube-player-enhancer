import Settings from '~/models/settings'
import downArrow from '~/assets/down-arrow.svg'

const className = 'ype-force-scroll-button'
const interval = 100
let settings: Settings
let enabled: boolean
let timer: number

const updateButton = () => {
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
  iconButton.onclick = async () => {
    await chrome.runtime.sendMessage({
      type: 'tab-state-changed',
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

const removeButton = () => {
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

const init = () => {
  if (settings.forceScrollButtonEnabled) {
    addButton()
    setupTimer()
  } else {
    removeButton()
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'settings-changed':
      settings = data.settings
      init()
      return sendResponse()
    case 'tab-state-changed':
      enabled = data.tabState.forceScrollEnabled
      updateButton()
      setupTimer()
      return sendResponse()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.runtime.sendMessage({ type: 'content-loaded' })
  settings = data.settings
  enabled = data.tabState.forceScrollEnabled
  init()
})
