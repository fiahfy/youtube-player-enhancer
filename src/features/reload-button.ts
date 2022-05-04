import Settings from '~/models/settings'
import refresh from '~/assets/refresh.svg'

const className = 'ype-reload-button'
let settings: Settings

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
  iconButton.title = 'Reload Frame'
  iconButton.onclick = () => location.reload()
  iconButton.append(icon)
  iconButton.classList.add(className)

  refIconButton?.parentElement?.insertBefore(iconButton, refIconButton)

  // insert svg after wrapper button appended
  icon.innerHTML = refresh
}

const removeButton = () => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button'
  )
  const button = refIconButton?.parentElement?.querySelector(`.${className}`)
  button && button.remove()
}

const init = () => {
  settings.reloadButtonEnabled ? addButton() : removeButton()
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'settings-changed':
      settings = data.settings
      init()
      return sendResponse()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.runtime.sendMessage({ type: 'content-loaded' })
  settings = data.settings
  init()
})
