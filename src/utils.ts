export const isVideoUrl = () => new URL(location.href).pathname === '/watch'

export const querySelectorAsync = async <T extends Element = Element>(
  selector: string,
  options: Partial<{
    root: Element
    interval: number
    timeout: number
  }> = {},
) => {
  const { root = document, ...others } = options

  try {
    return await waitUntil(() => root.querySelector<T>(selector), others)
  } catch {
    return null
  }
}

export const waitUntil = <T>(
  predicate: () => T | Promise<T>,
  {
    interval = 100,
    timeout = 3000,
  }: Partial<{ interval: number; timeout: number }> = {},
) => {
  return new Promise<T>((resolve, reject) => {
    const expireTime = Date.now() + timeout

    const check = async () => {
      const result = await predicate()
      if (result) {
        return resolve(result)
      }

      if (Date.now() > expireTime) {
        return reject(new Error('Timeout'))
      }

      setTimeout(check, interval)
    }

    check()
  })
}
