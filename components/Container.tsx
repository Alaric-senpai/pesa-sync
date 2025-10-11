import React, { PropsWithChildren } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const Container = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaProvider className="flex-1">
      {children}
    </SafeAreaProvider>
  )
}

export default Container