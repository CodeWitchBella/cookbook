import React, { ElementType } from 'react'
import { View, ViewProps } from 'react-native'
import { Ghost, KawaiiMood } from 'react-kawaii'
import { useSpring, animated } from '@react-spring/native'

const interp = (r: number) => 15 * Math.sin(r)
const AnimatedView = animated<ElementType<ViewProps>>(View)

export function FloatingGhost({ mood }: { mood?: KawaiiMood }) {
  const [{ radians }] = useSpring(() => ({
    config: { duration: 3500 },
    from: { radians: 0 },
    to: async (next) => {
      while (1) await next({ radians: 2 * Math.PI, reset: true })
    },
    reset: true,
  }))
  return (
    <AnimatedView
      style={{
        transform: [{ translateY: radians.interpolate(interp) }],
      }}
    >
      <Ghost mood={mood} />
    </AnimatedView>
  )
}
