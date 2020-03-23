import { browser } from 'webextension-polyfill-ts'
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

const removeButton = (): void => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button'
  )
  const button = refIconButton?.parentElement?.querySelector(`.${className}`)
  button && button.remove()
}

const setup = () => {
  settings.reloadButtonEnabled ? addButton() : removeButton()
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, data } = message
  switch (id) {
    case 'settingsChanged':
      settings = data.settings
      return setup()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  settings = data.settings
  setup()
})
