import refresh from '~/assets/refresh.svg?raw'
import type { Settings } from '~/models'
import { querySelectorAsync } from '~/utils'

const className = 'ype-reload-button'
let settings: Settings

const addButton = async () => {
  const refButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-live-chat-button',
  )
  if (!refButton) {
    return
  }

  if (refButton.parentElement?.querySelector(`.${className}`)) {
    return
  }

  // Wait until child elements are added to the DOM

  await querySelectorAsync('.yt-icon-shape > div', {
    parent: refButton,
  })

  // Clone elements

  const wrapper = refButton.cloneNode(true) as HTMLElement

  const button = (
    await querySelectorAsync('yt-button-shape > button', {
      parent: refButton,
    })
  )?.cloneNode(true) as HTMLElement

  if (!button) {
    return
  }

  // Setup elements

  wrapper.classList.add(className)
  wrapper.title = 'Reload Frame'
  wrapper.onclick = () => location.reload()

  const div = button.querySelector('.yt-icon-shape > div')
  if (!div) {
    return
  }
  div.innerHTML = refresh
  const svg = button.querySelector('svg')
  if (!svg) {
    return
  }
  svg.setAttribute('fill', 'currentColor')

  // Insert elements

  refButton.parentElement?.insertBefore(wrapper, refButton)

  const buttonShape = await querySelectorAsync('yt-button-shape', {
    parent: wrapper,
  })
  if (!buttonShape) {
    return
  }
  buttonShape.append(button)
}

const removeButton = () => {
  const refButton = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer > yt-live-chat-button',
  )
  if (!refButton) {
    return
  }

  const button = refButton.parentElement?.querySelector(`.${className}`)
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
      init().then(() => sendResponse())
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
})
