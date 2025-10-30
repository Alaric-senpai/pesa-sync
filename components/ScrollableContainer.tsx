import { View, Text, ScrollView, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import Container from './Container'
import { cn } from '@/lib/utils'

export default function ScrollableContainer({children, className}: {children:React.ReactNode, className?:StyleProp<ViewStyle>}) {
  return (
    <Container>
        <ScrollView className={cn('flex-1')} contentContainerStyle={className} showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    </Container>
  )
}