import refresh from '~/assets/refresh.svg?raw'
import type { Settings } from '~/models'

const className = 'ype-reload-button'
let settings: Settings

const addButton = async () => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-live-chat-button',
  )
  if (refIconButton?.parentElement?.querySelector(`.${className}`)) {
    return
  }

  const liveChatButton = document.createElement('yt-live-chat-button')
  liveChatButton.classList.add('style-scope', 'yt-live-chat-header-renderer')
  liveChatButton.title = 'Reload Frame'
  liveChatButton.onclick = () => location.reload()
  liveChatButton.classList.add(className)

  refIconButton?.parentElement?.insertBefore(liveChatButton, refIconButton)

  // insert svg after wrapper button appended
  // liveChatButton.innerHTML = refresh

  await new Promise((r) => setTimeout(r, 500))
  const button = document.createElement('button')
  button.innerHTML = refresh

  refIconButton?.parentElement
    ?.querySelector(`.${className} > yt-button-renderer > yt-button-shape`)
    ?.append(button)
}

const removeButton = () => {
  const refIconButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-icon-button',
  )
  const button = refIconButton?.parentElement?.querySelector(`.${className}`)
  button?.remove()
}

const init = async () => {
  settings.reloadButtonEnabled ? await addButton() : removeButton()
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

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
