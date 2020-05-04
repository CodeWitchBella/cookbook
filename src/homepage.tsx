import React, { useEffect, useState } from 'react'
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
        <Text style={{ marginTop: 20 }}>Zatím zde nic není</Text>
        <LinkButton to="/login">Přihlásit se</LinkButton>
      </View>
      <Text style={{ textAlign: 'right', padding: 10 }}>
        Verze: <BuildTime time={buildData.BUILD_TIME} />
      </Text>
    </View>
  )
}

function BuildTime({ time }: { time: DateTime }) {
  if (!time.isValid) return <Now />
  return <>{format(time)}</>
}

function Now() {
  const [now, setNow] = useState(DateTime.utc())
  useEffect(() => {
    const int = setInterval(() => {
      setNow(DateTime.utc())
    }, 1000)
    return () => clearInterval(int)
  }, [])
  return <>{format(now)}</>
}

function format(time: DateTime) {
  return time.toFormat('d. M. yyyy HH:mm:ss')
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
