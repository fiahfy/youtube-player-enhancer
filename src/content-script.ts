if (self == top) {
  // top window
  require('~/features/seek-buttons')
  require('~/features/video-quality-fixer')
} else {
  // iframe (chat frame)
  require('~/features/force-scroll-button')
  require('~/features/reload-button')
}
