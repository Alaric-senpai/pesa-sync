import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Container from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <Container>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="pt-5 pb-4 px-5 bg-white shadow-sm">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="chevron-back" size={24} color="#0d9488" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Privacy Policy</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <Text className="text-gray-700 mb-4">
              At Pesa Sync, we take your privacy seriously. This policy explains how we handle your data.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">1. No Data Collection</Text>
            <Text className="text-gray-700 mb-4">
              Pesa Sync does not collect, store, or transmit any personal or financial information to external servers. All data remains on your device.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">2. Local Storage Only</Text>
            <Text className="text-gray-700 mb-4">
              Your financial data is stored locally in a SQLite database on your device. This database is not accessible to us or any third parties.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">3. SMS Processing</Text>
            <Text className="text-gray-700 mb-4">
              The app processes SMS messages from financial institutions you select. This processing happens entirely on your device. No SMS content is transmitted externally.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">4. Permissions</Text>
            <Text className="text-gray-700 mb-4">
              We only request permissions necessary for the app to function: SMS access (for financial tracking) and storage (for local database).
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">5. Data Security</Text>
            <Text className="text-gray-700 mb-4">
              Your data is protected by your device's security measures. We recommend using device encryption and secure lock screens.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">6. Third-Party Services</Text>
            <Text className="text-gray-700 mb-4">
              Pesa Sync does not integrate with any third-party services that would access your financial data.
            </Text>
          </View>
          
          <View className="bg-teal-50 w-11/12 m-auto rounded-2xl p-5 shadow-sm mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark-outline" size={24} color="#0d9488" className="mr-2" />
              <Text className="text-teal-800 font-bold">Your Data Stays With You</Text>
            </View>
            <Text className="text-teal-700">
              Pesa Sync is designed to be completely private. Your financial information never leaves your device, giving you complete control over your data.
            </Text>
          </View>
          
          <Text className="text-gray-500 text-sm text-center mb-6">
            Last updated: September 11, 2025
          </Text>
        </ScrollView>
      </View>
    </Container>
  );
}