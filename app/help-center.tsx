import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpCenterPage() {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How does Pesa Sync track my finances?',
      answer: 'Pesa Sync reads SMS messages from financial institutions you select and extracts transaction data. This data is stored locally on your device in a secure database.'
    },
    {
      id: '2',
      question: 'Is my financial data secure?',
      answer: 'Yes. All your data is stored locally on your device in an encrypted SQLite database. No data is transmitted to external servers, ensuring complete privacy.'
    },
    {
      id: '3',
      question: 'Which financial institutions are supported?',
      answer: 'Pesa Sync works with any financial institution that sends transaction details via SMS. You can select which senders to monitor during setup.'
    },
    {
      id: '4',
      question: 'Does the app work offline?',
      answer: 'Yes, Pesa Sync is designed to work completely offline. It only requires internet for initial setup and updates, but all financial tracking happens locally.'
    },
    {
      id: '5',
      question: 'How do I backup my data?',
      answer: 'You can export your data from the app settings. This creates a backup file that you can store securely and import if needed.'
    },
    {
      id: '6',
      question: 'Can I use the app on multiple devices?',
      answer: 'Currently, Pesa Sync is designed for single-device use. Your data is stored locally and not synced across devices.'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <Container>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="pt-5 pb-4 px-5 bg-white shadow-sm">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="chevron-back" size={24} color="#0d9488" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Help Center</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <Text className="text-gray-700 mb-4">
              Find answers to common questions about using Pesa Sync. Can't find what you're looking for? Contact our support team.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-4">Frequently Asked Questions</Text>
            
            {faqs.map((faq) => (
              <View key={faq.id} className="mb-4">
                <TouchableOpacity 
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                  onPress={() => toggleExpand(faq.id)}
                >
                  <Text className="text-gray-800 font-medium flex-1">{faq.question}</Text>
                  <Ionicons 
                    name={expandedItem === faq.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
                
                {expandedItem === faq.id && (
                  <Text className="text-gray-600 py-3">{faq.answer}</Text>
                )}
              </View>
            ))}
          </View>
          
          <View className="bg-teal-50 rounded-2xl p-5 shadow-sm mb-8 w-11/12 m-auto">
            <View className="flex-row items-center mb-3">
              <Ionicons name="headset-outline" size={24} color="#0d9488" className="mr-2" />
              <Text className="text-teal-800 font-bold">Still need help?</Text>
            </View>
            <Text className="text-teal-700 mb-4">
              Our support team is ready to assist you with any questions or issues you may have.
            </Text>
            <TouchableOpacity 
              className="bg-teal-600 py-3 rounded-xl items-center"
              onPress={() => router.push('/contactus')}
            >
              <Text className="text-white font-medium">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}