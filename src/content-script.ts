if (self === top) {
  chrome.runtime.sendMessage({ type: 'loaded' })
  require('~/features/seek-buttons')
  require('~/features/elapsed-time')
  require('~/features/timestamp-anchor')
} else {
  chrome.runtime.sendMessage({ type: 'iframe-loaded' })
}
