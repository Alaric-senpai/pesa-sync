// @ts-nocheck
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const getIcon = (routeName: string, isFocused: boolean) => {
    const iconSize = 24
    const iconColor = isFocused ? '#0d9488' : '#64748b'
    
    switch (routeName) {
      case 'index':
        return <Feather name="home" size={iconSize} color={iconColor} />
      case 'search':
        return <Feather name="search" size={iconSize} color={iconColor} />
      case 'spending':
        return <MaterialCommunityIcons name="wallet" size={iconSize} color={iconColor} />
      case 'profile':
        return <Ionicons name="person" size={iconSize} color={iconColor} />
      case 'contacts':
        return <Ionicons name="people" size={iconSize} color={iconColor} />
      default:
        return <Feather name="circle" size={iconSize} color={iconColor} />
    }
  }

  const handleTabPress = (index: number, routeName: string, routeKey: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    })
    
    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(routeName)
    }
  }

  return (
    <View style={[styles.container, { marginBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          
          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={() => handleTabPress(index, route.name, route.key)}
              style={styles.tabButton}
            >
              <View style={styles.tabContent}>
                {getIcon(route.name, isFocused)}
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0d9488',
    marginTop: 4,
  },
})