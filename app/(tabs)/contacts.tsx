import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'

export default function ContactsDemo() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedContacts, setSelectedContacts] = useState<Contacts.Contact[]>([])

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredContacts(contacts)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = contacts.filter(contact => 
        contact.name?.toLowerCase().includes(query) || 
        contact.phoneNumbers?.some(phone => phone.number.includes(query))
      )
      setFilteredContacts(filtered)
    }
  }, [searchQuery, contacts])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { status } = await Contacts.requestPermissionsAsync()
      
      if (status === 'granted') {
        setPermissionGranted(true)
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Emails,
            Contacts.Fields.Image,
          ],
          sort: Contacts.SortTypes.FirstName,
        })
        
        setContacts(data)
        setFilteredContacts(data)
      } else {
        setPermissionGranted(false)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleContactSelection = (contact: Contacts.Contact) => {
    if (selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id))
    } else {
      setSelectedContacts([...selectedContacts, contact])
    }
  }

  const getContactInitials = (contact: Contacts.Contact) => {
    if (!contact.name) return '?'
    const names = contact.name.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return contact.name.charAt(0).toUpperCase()
  }

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id)
    
    return (
      <TouchableOpacity 
        className={`flex-row items-center p-4 border-b border-gray-100 ${isSelected ? 'bg-teal-50' : 'bg-white'}`}
        onPress={() => toggleContactSelection(item)}
      >
        <View className="mr-3">
          {item.imageAvailable && item.image ? (
            <Avatar className="w-12 h-12" alt='contact avatar'>
              <AvatarImage source={{ uri: item.image.uri }} />
            </Avatar>
          ) : (
            <Avatar className="w-12 h-12 bg-teal-100" alt='contact avatar'>
              <AvatarFallback>
                <Text className="text-teal-800 font-bold">{getContactInitials(item)}</Text>
              </AvatarFallback>
            </Avatar>
          )}
        </View>
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">{item.name || 'No Name'}</Text>
          {item.phoneNumbers && item.phoneNumbers.length > 0 && (
            <Text className="text-gray-500 text-sm">{item.phoneNumbers[0].number}</Text>
          )}
        </View>
        
        {isSelected && (
          <View className="w-6 h-6 rounded-full bg-teal-500 items-center justify-center">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <ActivityIndicator size="large" color="#0d9488" />
          <Text className="text-gray-500 mt-4">Loading contacts...</Text>
        </View>
      )
    }
    
    if (!permissionGranted) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-5">
          <Ionicons name="lock-closed-outline" size={60} color="#cbd5e1" />
          <Text className="text-gray-500 mt-4 text-center">
            Permission to access contacts was denied. Please enable it in your device settings.
          </Text>
          <TouchableOpacity 
            className="mt-6 bg-teal-600 py-3 px-6 rounded-full"
            onPress={fetchContacts}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
    if (contacts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-5">
          <Ionicons name="people-outline" size={60} color="#cbd5e1" />
          <Text className="text-gray-500 mt-4 text-center">
            No contacts found on your device.
          </Text>
        </View>
      )
    }
    
    if (filteredContacts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-5">
          <Ionicons name="search-outline" size={60} color="#cbd5e1" />
          <Text className="text-gray-500 mt-4 text-center">
            No contacts match your search query.
          </Text>
        </View>
      )
    }
    
    return null
  }

  return (
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="pt-12 pb-4 px-5 bg-white shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Your Contacts</Text>
          
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
            <Ionicons name="search" size={20} color="#64748b" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Selection Info */}
        {selectedContacts.length > 0 && (
          <View className="px-5 py-3 bg-teal-50 flex-row items-center justify-between">
            <Text className="text-teal-800 font-medium">
              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
            </Text>
            <TouchableOpacity onPress={() => setSelectedContacts([])}>
              <Text className="text-teal-600">Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contacts List */}
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
  )
}