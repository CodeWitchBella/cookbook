export class MiniEventTarget<T> {
  private listeners = new Set<(data: T) => void>()
  listen = (listener: (data: T) => void) => {
    const copy = (data: T) => void listener(data)
    this.listeners.add(copy)
    return () => void this.listeners.delete(copy)
  }
  emit = (data: T) => {
    setImmediate(() => {
      this.listeners.forEach((l) => {
        try {
          l(data)
        } catch (e) {
          console.warn(e)
        }
      })
    })
  }
}
