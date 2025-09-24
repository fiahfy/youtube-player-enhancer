import '~/content-script-frame.css'

import('~/features/reload-button')

chrome.runtime.sendMessage({ type: 'iframe-loaded' })
