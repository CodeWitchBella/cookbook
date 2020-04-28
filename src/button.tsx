import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
// @ts-ignore
import { useNavigate } from 'react-router-dom'

export function Button({
  onPress,
  children,
}: {
  onPress: () => void
  children: string
}) {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        margin: 8,
      }}
      onPress={onPress}
    >
      <Text style={{ color: 'black' }}>{children}</Text>
    </TouchableOpacity>
  )
}

export function LinkButton({ to, children }: { to: string; children: string }) {
  const navigate = useNavigate()
  return (
    <Button
      onPress={() => {
        navigate(to, { state: { canGoBack: true } })
      }}
    >
      {children}
    </Button>
  )
}
