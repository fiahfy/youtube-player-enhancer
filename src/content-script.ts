import { browser } from 'webextension-polyfill-ts'

if (self === top) {
  browser.runtime.sendMessage({ id: 'loaded' })
  require('~/features/seek-buttons')
  require('~/features/elapsed-time')
  require('~/features/timestamp-anchor')
  // require('~/features/video-quality-fixer')
} else {
  browser.runtime.sendMessage({ id: 'iframeLoaded' })
  // require('~/features/force-scroll-button')
  require('~/features/reload-button')
}
