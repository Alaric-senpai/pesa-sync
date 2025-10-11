import Container from '@/components/Container'
import CustomTabBar from '@/components/CustomTabBar'
import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
  return (
    // <Container>
        <Tabs tabBar={(props:any)=> <CustomTabBar {...props} />} >
            <Tabs.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
            <Tabs.Screen name="contacts" options={{ headerShown: false, title: 'Contacts' }} />
            <Tabs.Screen name="spending" options={{ headerShown: false, title: 'Spending' }} />
            <Tabs.Screen name="profile" options={{ headerShown: false, title: 'Profile' }} />
        </Tabs>
    // </Container>
  )
}

export default TabsLayout