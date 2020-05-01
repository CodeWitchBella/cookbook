import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FloatingGhost } from 'floating-ghost'
import { LinkButton } from './button'
import { getDeviceInfo } from 'login'
import { apiHost } from 'api'

export function Homepage() {
  console.log(getDeviceInfo())
  return (
    <View style={styles.container}>
      <FloatingGhost />
      <Text style={{ marginTop: 20 }}>Nothing to see here, yet!</Text>
      <LinkButton to="/login">Přihlásit se</LinkButton>
      <View>
        <Text>{JSON.stringify(getDeviceInfo(), null, 2)}</Text>
        <Text>{apiHost}</Text>
      </View>
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
