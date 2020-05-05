import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './button'

export function BackButton({ style }: { style?: ViewStyle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const canGoBack = (location.state as any).canGoBack
  if (!canGoBack && location.pathname === '/') return null
  return (
    <View style={[style, { height: 0, alignItems: 'flex-start' }]}>
      <Button
        onPress={() => {
          if (canGoBack) navigate(-1)
          else navigate('/')
        }}
      >
        Zpět
      </Button>
    </View>
  )
}
