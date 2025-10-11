import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalContext'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserAvatar } from '@/constants/images'
import Container from '@/components/Container'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

export default function ProfileScreen() {
  const { currentUser, logout } = useGlobalContext()
  const router = useRouter()

  // Profile menu items
  const accountSettings = [
    // { 
    //   id: '1', 
    //   title: 'Edit Profile', 
    //   icon: 'person-outline', 
    //   onPress: () => router.push('/')
    // },
    // { 
    //   id: '2', 
    //   title: 'Change Password', 
    //   icon: 'lock-closed-outline', 
    //   onPress: () => router.push('/')
    // },
    // { 
    //   id: '3', 
    //   title: 'Payment Methods', 
    //   icon: 'card-outline', 
    //   onPress: () => router.push('/')
    // },
    { 
      id: '4', 
      title: 'Notification Settings', 
      icon: 'notifications-outline', 
      onPress: () => router.push('/notifications')
    },
  ]

  const appSettings = [
    // { 
    //   id: '5', 
    //   title: 'Appearance', 
    //   icon: 'color-palette-outline', 
    //   onPress: () => router.push('/')
    // },
    // { 
    //   id: '6', 
    //   title: 'Language', 
    //   icon: 'language-outline', 
    //   onPress: () => router.push('/')
    // },
    { 
      id: '7', 
      title: 'Privacy & Security', 
      icon: 'shield-checkmark-outline', 
      onPress: () => router.push('/privacy')
    },
  ]

  const supportOptions = [
    { 
      id: '8', 
      title: 'Help Center', 
      icon: 'help-circle-outline', 
      onPress: () => router.push('/help-center')
    },
    { 
      id: '9', 
      title: 'Contact Us', 
      icon: 'mail-outline', 
      onPress: () => router.push('/contactus')
    },
    { 
      id: '10', 
      title: 'Terms of Service', 
      icon: 'document-text-outline', 
      onPress: () => router.push('/terms')
    },
    { 
      id: '11', 
      title: 'Privacy Policy', 
      icon: 'lock-closed-outline', 
      onPress: () => router.push('/privacy')
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      console.log('✅ User logged out successfully')
      router.replace('/onboarding')
    } catch (error) {
      console.error('❌ Logout failed:', error)
    }
  }

  return (
      <ScrollView className="flex-1 bg-gray-50 mb-28" showsVerticalScrollIndicator={false}>

          <View className="items-center">
            <Avatar alt="user avatar" className="shadow-lg border-4 border-white rounded-full w-72 h-72 overflow-hidden">
              <AvatarImage source={UserAvatar} />
              <AvatarFallback className="bg-teal-100">
                <Text className="font-bold text-teal-800 text-3xl">{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</Text>
              </AvatarFallback>
            </Avatar>
            
            <Text className="mt-4 font-bold text-2xl">{currentUser?.name || 'User'}</Text>
            <Text className="mt-1 text-lg">{currentUser?.email || ''}</Text>
            <Text className="mt-1 text-gray-600 text-base">{currentUser?.phone || ''}</Text>
            
            <TouchableOpacity 
              className="bg-black/20 backdrop-blur-sm mt-4 px-6 py-2 border border-black/30 rounded-full"
              onPress={() => router.push('/')}
            >
              <Text className="font-medium text-white">Edit Profile</Text>
            </TouchableOpacity>
          </View>

        {/* Account Settings Section */}
        <View className="mt-6 px-5">
          <Text className="mb-3 font-medium text-gray-500 text-sm">ACCOUNT SETTINGS</Text>
          <View className="bg-white shadow-sm rounded-2xl overflow-hidden">
            {accountSettings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row justify-between items-center p-4 border-gray-100 border-b"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="justify-center items-center bg-teal-50 mr-3 rounded-full w-10 h-10">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="font-medium text-gray-800">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Settings Section */}
        <View className="mt-6 px-5">
          <Text className="mb-3 font-medium text-gray-500 text-sm">APP SETTINGS</Text>
          <View className="bg-white shadow-sm rounded-2xl overflow-hidden">
            {appSettings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row justify-between items-center p-4 border-gray-100 border-b"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="justify-center items-center bg-teal-50 mr-3 rounded-full w-10 h-10">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="font-medium text-gray-800">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View className="mt-6 px-5">
          <Text className="mb-3 font-medium text-gray-500 text-sm">SUPPORT</Text>
          <View className="bg-white shadow-sm rounded-2xl overflow-hidden">
            {supportOptions.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row justify-between items-center p-4 border-gray-100 border-b"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="justify-center items-center bg-teal-50 mr-3 rounded-full w-10 h-10">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="font-medium text-gray-800">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-6 mb-8 px-5">
          <TouchableOpacity 
            className="items-center bg-white shadow-sm p-4 rounded-2xl"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text className="ml-2 font-medium text-red-500">Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-sm">Pesa Sync v1.0.0</Text>
        </View>
      </ScrollView>
  )
}