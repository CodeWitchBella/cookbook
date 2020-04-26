import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ghost } from 'react-kawaii'

export function App() {
  return (
    <View style={styles.container}>
      <Ghost />
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
