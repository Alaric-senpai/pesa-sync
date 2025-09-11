import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ContactUsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // In a real app, this would send the message
    console.log({ name, email, subject, message });
    alert('Thank you for your message! We\'ll get back to you soon.');
    router.back();
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
            <Text className="text-xl font-bold text-gray-800">Contact Us</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <Text className="text-gray-700 mb-4">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Text>
            
            <Text className="font-bold text-gray-800 mb-2">Name</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
            
            <Text className="font-bold text-gray-800 mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text className="font-bold text-gray-800 mb-2">Subject</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
              placeholder="What is this about?"
              value={subject}
              onChangeText={setSubject}
            />
            
            <Text className="font-bold text-gray-800 mb-2">Message</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-6 text-gray-800"
              placeholder="Your message..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              className="bg-teal-600 py-4 rounded-xl items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold text-lg">Send Message</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <Text className="font-bold text-gray-800 mb-4">Other Ways to Reach Us</Text>
            
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={22} color="#0d9488" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Email</Text>
                <Text className="text-gray-600">support@pesasync.com</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                <Ionicons name="time-outline" size={22} color="#0d9488" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Response Time</Text>
                <Text className="text-gray-600">Usually within 24-48 hours</Text>
              </View>
            </View>
          </View>
          
          <View className="bg-teal-50 rounded-2xl p-5 shadow-sm mb-8">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark-outline" size={24} color="#0d9488" className="mr-2" />
              <Text className="text-teal-800 font-bold">Privacy Assurance</Text>
            </View>
            <Text className="text-teal-700">
              Any information you provide will only be used to respond to your inquiry. We do not store or share your contact information.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}