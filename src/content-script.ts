const url = new URL(location.href)
const videoUrl = url.pathname === '/watch'
const chatUrl = !!url.pathname.match(/^\/live_chat/)

if (videoUrl) {
  require('~/features/seek-buttons')
  require('~/features/video-quality-fixer')
}
if (chatUrl) {
  // require('~/features/force-scroll-button')
  require('~/features/reload-button')
}
