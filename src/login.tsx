import React, { useState, useRef, forwardRef } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TextInputProps,
  Platform,
} from 'react-native'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const passwordRef = useRef<TextInput>(null)

  const submit = () => {}

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
        <Space />
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
        <TouchableOpacity onPress={submit}>
          <Text>Přihlásit se</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function Space() {
  return <View style={{ height: 5 }} />
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
