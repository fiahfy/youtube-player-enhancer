import '~/content-script.css'

import('~/features/skip-controls')
import('~/features/timestamp-scroll')

chrome.runtime.sendMessage({ type: 'loaded' })
