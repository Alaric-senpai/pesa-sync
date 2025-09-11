import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Container from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TermsPage() {
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
            <Text className="text-xl font-bold text-gray-800">Terms of Service</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <Text className="text-gray-700 mb-4">
              Welcome to Pesa Sync! These terms of service outline your rights and responsibilities when using our app.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">1. Acceptance of Terms</Text>
            <Text className="text-gray-700 mb-4">
              By downloading and using Pesa Sync, you agree to be bound by these Terms of Service.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">2. Offline Operation</Text>
            <Text className="text-gray-700 mb-4">
              Pesa Sync operates entirely on your device. No data is transmitted to external servers. All financial information is stored locally on your device.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">3. SMS Access</Text>
            <Text className="text-gray-700 mb-4">
              The app requires permission to read SMS messages from financial institutions you select. This data is processed locally and never leaves your device.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">4. User Responsibilities</Text>
            <Text className="text-gray-700 mb-4">
              You are responsible for maintaining the security of your device and the accuracy of your financial data.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">5. Limitation of Liability</Text>
            <Text className="text-gray-700 mb-4">
              Pesa Sync is provided "as is" without warranties of any kind. We are not responsible for financial decisions made based on app data.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">6. Changes to Terms</Text>
            <Text className="text-gray-700 mb-4">
              We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of modified terms.
            </Text>
          </View>
          
          <View className="bg-teal-50 rounded-2xl p-5 shadow-sm mb-8">
            <Text className="text-teal-800 font-bold mb-2">Important Note:</Text>
            <Text className="text-teal-700">
              Pesa Sync does not collect, store, or transmit any personal or financial data to external servers. All processing happens locally on your device.
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