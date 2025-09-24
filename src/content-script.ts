import '~/content-script.css'

import('~/features/seek-buttons')
import('~/features/timestamp-anchor')

chrome.runtime.sendMessage({ type: 'loaded' })
