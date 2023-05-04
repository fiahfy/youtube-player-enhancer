import './content-script.css'

if (self === top) {
  chrome.runtime.sendMessage({ type: 'loaded' })
  import('~/features/seek-buttons')
  import('~/features/elapsed-time')
  import('~/features/timestamp-anchor')
} else {
  chrome.runtime.sendMessage({ type: 'iframe-loaded' })
}
