import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FloatingGhost } from 'floating-ghost'
// @ts-ignore
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from 'login'
import { BackButton } from 'back-button'
import { Homepage } from 'homepage'
import { useUserStore } from 'user'

export function App() {
  const userStore = useUserStore()
  return (
    <BrowserRouter>
      <View style={{ flexDirection: 'column-reverse', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login userStore={userStore} />} />
          <Route
            path="*"
            element={
              <View style={styles.container}>
                <FloatingGhost mood="sad" />
                <Text style={{ marginTop: 30, fontSize: 20 }}>
                  404 Not found
                </Text>
              </View>
            }
          />
        </Routes>
        <BackButton />
      </View>
    </BrowserRouter>
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
