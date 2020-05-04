import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FloatingGhost } from 'floating-ghost'
import { LinkButton } from './button'
import { getDeviceInfo } from 'user'
import { buildData } from 'build-data'
import { DateTime } from 'luxon'

export function Homepage() {
  useEffect(() => {
    console.log(getDeviceInfo())
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FloatingGhost />
        <Text style={{ marginTop: 20 }}>Nothing to see here, yet!</Text>
        <LinkButton to="/login">Přihlásit se</LinkButton>
      </View>
      <Text style={{ textAlign: 'right', padding: 10 }}>
        Verze: {formatBuildTime(buildData.BUILD_TIME)}
      </Text>
    </View>
  )
}

function formatBuildTime(date: string) {
  const dt = DateTime.fromISO(date)
  if (!dt.isValid) return date
  return dt.toFormat('d. M. yyyy hh:mm:ss')
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
})
