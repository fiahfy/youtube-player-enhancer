export const isVideoUrl = () => new URL(location.href).pathname === '/watch'

export const querySelectorAsync = <T extends Element = Element>(
  selector: string,
  options: Partial<{
    parent: Element | null
    interval: number
    timeout: number
  }> = {},
) => {
  const { parent = document, interval = 100, timeout = 10000 } = options

  if (!parent) {
    return Promise.resolve(null)
  }

  return new Promise<T | null>((resolve) => {
    const expireTime = Date.now() + timeout
    const timer = window.setInterval(() => {
      const e = parent.querySelector<T>(selector)
      if (e || Date.now() > expireTime) {
        clearInterval(timer)
        resolve(e)
      }
    }, interval)
  })
}
