export const isVideoUrl = () => new URL(location.href).pathname === '/watch'

export const querySelectorAsync = (
  selector: string,
  options: Partial<{
    parent: Element | null
    interval: number
    timeout: number
  }> = {},
) => {
  const { parent = document, interval = 100, timeout = 10000 } = options

  if (!parent) {
    return null
  }

  return new Promise<Element | null>((resolve) => {
    const expireTime = Date.now() + timeout
    const timer = window.setInterval(() => {
      const e = parent.querySelector(selector)
      if (e || Date.now() > expireTime) {
        clearInterval(timer)
        resolve(e)
      }
    }, interval)
  })
}
