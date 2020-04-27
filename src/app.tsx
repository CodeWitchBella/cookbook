import React, { ElementType } from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { Ghost } from 'react-kawaii'
import { useSpring, animated } from '@react-spring/native'

const interp = (r: number) => 15 * Math.sin(r)
const AnimatedView = animated<ElementType<ViewProps>>(View)

export function App() {
  const [{ radians }] = useSpring(() => ({
    config: { duration: 3500 },
    from: { radians: 0 },
    to: async (next) => {
      while (1) await next({ radians: 2 * Math.PI, reset: true })
    },
    reset: true,
  }))
  return (
    <View style={styles.container}>
      <AnimatedView
        style={{
          transform: [{ translateY: radians.interpolate(interp) }],
        }}
      >
        <Ghost />
      </AnimatedView>
      <Text style={{ marginTop: 20 }}>Nothing to see here, yet!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
