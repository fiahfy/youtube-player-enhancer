export const isVideoUrl = (): boolean =>
  new URL(location.href).pathname === '/watch'
