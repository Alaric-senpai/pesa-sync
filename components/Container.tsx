import React, { PropsWithChildren } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView className="flex-1 ">
      {children}
    </SafeAreaView>
  )
}

export default Container