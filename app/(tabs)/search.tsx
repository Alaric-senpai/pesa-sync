import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Container from '@/components/Container'
import { useGlobalContext } from '@/context/GlobalContext'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const recentSearches = ['Groceries', 'Electricity bill', 'Netflix subscription', 'Gas refill']
  
  const popularCategories = [
    { id: '1', name: 'Food & Dining', icon: 'restaurant' },
    { id: '2', name: 'Transportation', icon: 'car' },
    { id: '3', name: 'Shopping', icon: 'cart' },
    { id: '4', name: 'Entertainment', icon: 'film' },
    { id: '5', name: 'Bills & Utilities', icon: 'document-text' },
    { id: '6', name: 'Healthcare', icon: 'medical' },
  ]

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
      <View className="flex-1 bg-gray-50">
        <View className="pt-12 pb-4 px-5 bg-white shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-800">Search</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="filter" size={24} color="#0d9488" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
            <Ionicons name="search" size={20} color="#64748b" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Search transactions, categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content Area */}
        <ScrollView 
          className="flex-1 px-5 pt-5 mb-28" 
          showsVerticalScrollIndicator={false}
        >
          {/* Recent Searches */}
          {searchQuery.length === 0 && (
            <>
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-800">Recent Searches</Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text className="text-teal-600 font-medium">Clear all</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="flex-row flex-wrap">
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity 
                      key={index} 
                      className="bg-white rounded-full px-4 py-2 mr-2 mb-2 shadow-sm"
                      onPress={() => setSearchQuery(search)}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#64748b" className="mr-1" />
                        <Text className="text-gray-700">{search}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Popular Categories */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Popular Categories</Text>
                <View className="grid grid-cols-2 gap-4">
                  {popularCategories.map((category) => (
                    <TouchableOpacity 
                      key={category.id} 
                      className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center"
                      onPress={() => setSearchQuery(category.name)}
                    >
                      <View className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center mr-3">
                        <Ionicons name={category.icon as unknown as any} size={20} color="#0d9488" />
                      </View>
                      <Text className="text-gray-700 font-medium">{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Search Tips */}
              <View className="bg-teal-50 rounded-2xl p-5 mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="bulb-outline" size={24} color="#0d9488" className="mr-2" />
                  <Text className="text-lg font-bold text-teal-800">Search Tips</Text>
                </View>
                <Text className="text-teal-700">
                  Try searching for specific amounts, dates, or merchant names. You can also search by category tags.
                </Text>
              </View>
            </>
          )}
          
          {/* Search Results Placeholder */}
          {searchQuery.length > 0 && (
            <View className="flex-1 items-center justify-center py-10">
              <Ionicons name="search" size={60} color="#cbd5e1" />
              <Text className="text-gray-500 mt-4 text-center">
                Searching for "{searchQuery}"...
              </Text>
              <Text className="text-gray-400 mt-2 text-center">
                Results will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
  )
}