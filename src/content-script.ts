import '~/content-script.css'

import('~/features/skip-controls')
import('~/features/timestamp-anchor')

chrome.runtime.sendMessage({ type: 'loaded' })
