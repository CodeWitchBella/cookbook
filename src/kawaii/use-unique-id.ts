import { useRef } from 'react'

let counter = 0
export function useUniqueId() {
  return useRef(counter++).current
}
