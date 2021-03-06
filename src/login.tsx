import React, { useState, useRef, forwardRef, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TextInputProps,
  Platform,
} from 'react-native'
import type { UserStore } from './user'
import { KawaiiChocolate } from './kawaii/chocolate'
import type { KawaiiMood } from 'react-kawaii'

function useLast<T>(v: T): T {
  const ref = useRef(v)
  useEffect(() => {
    ref.current = v
  })
  return ref.current
}

export default function Login({ userStore }: { userStore: UserStore }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const passwordRef = useRef<TextInput>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const last = useLast({ email, password })
  const justErrored =
    error && email === last.email && password === last.password

  const submittingRef = useRef(false)

  if (userStore.state.loading) {
    return <View />
  }

  if (userStore.state.user) {
    return (
      <Base mood="lovestruck">
        <Space size={10} />
        <Text>
          Hotovo! 🎉
          {'\n'}Tvůj email: {userStore.state.user.email}
        </Text>
      </Base>
    )
  }

  const submit = () => {
    if (submittingRef.current) return

    submittingRef.current = true
    setSubmitting(true)

    userStore
      .login({ email, password })
      .then((err) => {
        setError(err || '')
      })
      .catch((e) => {
        console.warn(e)
        setError('Něco se pokazilo')
      })
      .then(() => {
        setSubmitting(false)
        submittingRef.current = false
      })
  }

  return (
    <Base
      mood={
        submitting
          ? 'blissful'
          : justErrored
          ? 'shocked'
          : email.includes('@')
          ? 'excited'
          : 'happy'
      }
    >
      <Space size={20}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </Space>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Sem napiš svůj email"
        autoCapitalize="none"
        onSubmitEditing={() => passwordRef.current?.focus()}
        keyboardType="email-address"
        returnKeyType="next"
        textContentType="emailAddress"
        {...(Platform.OS === 'android'
          ? { importantForAutofill: 'yes', autoCompleteType: 'email' }
          : {})}
      />
      <Space />
      <Input
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="Sem napiš své heslo"
        secureTextEntry={true}
        autoCapitalize="none"
        onSubmitEditing={submit}
        returnKeyType="done"
        textContentType="password"
        {...(Platform.OS === 'android'
          ? { importantForAutofill: 'yes', autoCompleteType: 'password' }
          : {})}
      />
      <Space />
      <TouchableOpacity onPress={submit} disabled={submitting}>
        <Text>{submitting ? 'Přihlašuji tě...' : 'Přihlásit se'}</Text>
      </TouchableOpacity>
    </Base>
  )
}

function Base({
  children,
  mood,
}: React.PropsWithChildren<{ mood: KawaiiMood }>) {
  return (
    <View style={{ minHeight: '100%', justifyContent: 'center' }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
        }}
      >
        <KawaiiChocolate style={{ padding: 10 }} mood={mood} />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '500' }}>Přihlášení</Text>
          {children}
        </View>
      </View>
    </View>
  )
}

function Space({
  children,
  size = 5,
}: React.PropsWithChildren<{ size?: number }>) {
  return <View style={{ height: size }}>{children}</View>
}

const Input = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        props.style,
        {
          borderWidth: 1,
          borderColor: 'black',
          paddingVertical: 2,
          paddingHorizontal: 7,
        },
      ]}
    />
  )
})
