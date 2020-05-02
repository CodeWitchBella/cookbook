import { Duration } from 'luxon'
import type { DurationObject } from 'luxon'

export function timeout(duration: DurationObject | number, cb: () => void) {
  let done = false
  let timeout = setTimeout(
    () => {
      done = true
      cb()
    },
    typeof duration === 'number'
      ? duration
      : Duration.fromObject(duration).as('millisecond'),
  )
  return () => {
    if (!done) clearTimeout(timeout)
  }
}
