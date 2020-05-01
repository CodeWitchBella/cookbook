import React, { useState, useRef, forwardRef, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TextInputProps,
  Platform,
} from 'react-native'
import Constants from 'expo-constants'
import type { UserStore } from './user'
// @ts-ignore
import { useNavigate } from 'react-router-dom'

export default function Login({ userStore }: { userStore: UserStore }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const passwordRef = useRef<TextInput>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submittingRef = useRef(false)
  useRedirectOnLogin(userStore)

  if (userStore.state.loading) {
    return <View />
  }

  if (userStore.state.user) {
    return (
      <Base>
        <Space size={10} />
        <Text>
          Hotovo! {/*eslint-disable-next-line jsx-a11y/accessible-emoji*/}
          <Text accessibilityRole="image" accessibilityLabel="konfetovač">
            🎉
          </Text>
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
    <Base>
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

function useRedirectOnLogin(userStore: UserStore) {
  const emailStatus = userStore.state.loading
    ? 'loading'
    : userStore.state.user?.email
  const prevEmailStatus = useRef(emailStatus)
  const navigate = useNavigate()

  useEffect(() => {
    if (!prevEmailStatus.current && emailStatus) {
      navigate('/')
    }

    prevEmailStatus.current = emailStatus
  }, [emailStatus, navigate])
}

function Base({ children }: React.PropsWithChildren<{}>) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <View>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>Přihlášení</Text>
        {children}
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

export function getDeviceInfo() {
  const ret: { [key: string]: string | number | null | undefined | boolean } = {
    deviceYearClass: Constants?.deviceYearClass,
    deviceName: Constants?.deviceName,

    installationId: Constants?.installationId,
    appOwnership: Constants?.appOwnership,
    expoVersion: Constants?.expoVersion,
    osName: Platform?.OS,
    osVersion: Platform?.Version,
    simulator: !Constants?.isDevice,
  }

  ret.expoReleaseChannel = Constants?.manifest?.releaseChannel
  ret.expoAppVersion = Constants?.manifest?.version
  ret.expoAppPublishedTime = Constants?.manifest?.publishedTime
  ret.expoSdkVersion = Constants?.sdkVersion
  ret.model = Constants?.platform?.ios?.model || 'n/a'
  if (Constants.platform?.web) ret.webUa = Constants.platform?.web.ua

  return ret
}
