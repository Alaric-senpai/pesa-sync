// @ts-nocheck
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import React, { use } from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
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

  // Handle tab press
  const handleTabPress = (index: number, routeName: string, routeKey: string) => {
    // Navigate to the tab
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
    <View style={[styles.container, { marginBottom: insets.bottom - 10 }]}>
      {/* Floating background with gradient */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.floatingBackground}
      >
        {/* Shadow for floating effect */}
        <View style={styles.shadow} />
        
        {/* Tab buttons */}
        <View style={styles.tabsContainer}>

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const label = options.tabBarLabel || options.title || route.name
            const isFocused = state.index === index
            
            return (
              <Pressable
                key={route.key}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={() => handleTabPress(index, route.name, route.key)}
                onLongPress={() => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  })
                }}
                style={[styles.tabButton, { transform: [{ scale: isFocused ? 1.1 : 1 }] }]}
              >
                <View className='flex-1 justify-center items-center'>
                  {getIcon(route.name, isFocused)}
                  {isFocused && (
                    <View style={styles.activeIndicator}>
                      <Text style={styles.activeText}>{label as string}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  floatingBackground: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeIndicator: {
    marginTop: 4,
    backgroundColor: '#0d9488',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
  },
})