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
  const { username, phoneNumber } = useGlobalContext()
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

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...')
    // For example: navigation.replace('login')
  }

  return (
      <ScrollView className="flex-1 bg-gray-50 mb-28" showsVerticalScrollIndicator={false}>

          <View className="items-center">
            <Avatar alt="user avatar" className="w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <AvatarImage source={UserAvatar} />
              <AvatarFallback className="bg-teal-100">
                <Text className="text-teal-800 font-bold text-3xl">{username?.charAt(0).toUpperCase()}</Text>
              </AvatarFallback>
            </Avatar>
            
            <Text className=" text-2xl font-bold mt-4">{username}</Text>
            <Text className=" text-lg mt-1">{phoneNumber}</Text>
            
            <TouchableOpacity 
              className="mt-4 bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-black/30"
              onPress={() => router.push('/')}
            >
              <Text className="text-white font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>

        {/* Account Settings Section */}
        <View className="mt-6 px-5">
          <Text className="text-gray-500 text-sm font-medium mb-3">ACCOUNT SETTINGS</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {accountSettings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row items-center justify-between p-4 border-b border-gray-100"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="text-gray-800 font-medium">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Settings Section */}
        <View className="mt-6 px-5">
          <Text className="text-gray-500 text-sm font-medium mb-3">APP SETTINGS</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {appSettings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row items-center justify-between p-4 border-b border-gray-100"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="text-gray-800 font-medium">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View className="mt-6 px-5">
          <Text className="text-gray-500 text-sm font-medium mb-3">SUPPORT</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {supportOptions.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="flex-row items-center justify-between p-4 border-b border-gray-100"
                onPress={item.onPress}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={22} color="#0d9488" />
                  </View>
                  <Text className="text-gray-800 font-medium">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-6 mb-8 px-5">
          <TouchableOpacity 
            className="bg-white rounded-2xl shadow-sm p-4 items-center"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text className="text-red-500 font-medium ml-2">Log Out</Text>
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