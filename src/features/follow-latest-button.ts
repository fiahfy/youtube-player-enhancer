import verticalAlignBottom from '~/assets/vertical_align_bottom.svg?raw'
import type { Settings } from '~/models'
import { querySelectorAsync } from '~/utils'

const className = 'ype-following-latest-button'
const activeClassName = 'ype-button-active'
let settings: Settings
let timer: number

const addButton = async () => {
  const refButtons = document.querySelectorAll(
    '#chat-messages > yt-live-chat-header-renderer > yt-live-chat-button',
  )
  const refButton = refButtons[refButtons.length - 1]
  if (!refButton) {
    return
  }

  if (refButton.parentElement?.querySelector(`.${className}`)) {
    return
  }

  // Wait until child elements are added to the DOM

  await querySelectorAsync('.yt-icon-shape > div', {
    root: refButton,
  })

  // Clone elements

  const wrapper = refButton.cloneNode(true) as HTMLElement

  const button = (
    await querySelectorAsync('yt-button-shape > button', {
      root: refButton,
    })
  )?.cloneNode(true) as HTMLElement

  if (!button) {
    return
  }

  // Setup elements

  wrapper.classList.add(className)
  wrapper.title = 'Follow Latest'
  wrapper.onclick = () =>
    chrome.runtime.sendMessage({ type: 'follow-latest-button-clicked' })

  const div = button.querySelector('.yt-icon-shape > div')
  if (!div) {
    return
  }
  div.innerHTML = verticalAlignBottom
  const svg = button.querySelector('svg')
  if (!svg) {
    return
  }
  svg.setAttribute('fill', 'currentColor')

  // Insert elements

  refButton.parentElement?.insertBefore(wrapper, refButton)

  const buttonShape = await querySelectorAsync('yt-button-shape', {
    root: wrapper,
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
  settings.enableFollowLatestButton ? await addButton() : removeButton()
}

const update = async (enableFollowLatest: boolean) => {
  const button = document.querySelector(`.${className}`)
  if (button) {
    if (enableFollowLatest) {
      button.classList.add(activeClassName)
    } else {
      button.classList.remove(activeClassName)
    }
  }

  if (enableFollowLatest) {
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
    timer = window.setInterval(scrollToBottom, 1000)
  } else {
    clearInterval(timer)
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'settings-changed':
      settings = data.settings
      init().then(() => sendResponse())
      return true
    case 'tab-state-changed':
      update(data.tabState.enableFollowLatest).then(() => sendResponse())
      return true
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then(async (data) => {
  settings = data.settings
  await init()
  await update(data.tabState.enableFollowLatest)
})
