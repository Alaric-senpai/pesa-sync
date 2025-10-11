import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Container from '@/components/Container'
import { getContactsWithDebtSummary } from '@/lib/actions/contacts.actions'
import { useRouter } from 'expo-router'

export default function ContactsListing() {
  const router = useRouter()
  const [contacts, setContacts] = useState<any[]>([])
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])

  useEffect(() => { fetchContacts() }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredContacts(contacts)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = contacts.filter(contact => {
        const nameMatch = contact.name?.toLowerCase().includes(query)
        const phoneMatch = !!contact.phone && contact.phone.includes(query)
        return nameMatch || phoneMatch
      })
      setFilteredContacts(filtered)
    }
  }, [searchQuery, contacts])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const dbContacts = await getContactsWithDebtSummary()
      setContacts(dbContacts)
      setFilteredContacts(dbContacts)
    } catch (error) {
      console.error('Error fetching contacts from DB:', error)
      setContacts([])
      setFilteredContacts([])
    } finally {
      setLoading(false)
    }
  }

  const toggleContactSelection = (contact: any) => {
    if (selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id))
    } else {
      setSelectedContacts([...selectedContacts, contact])
    }
  }

  const getContactInitials = (contact: any) => {
    if (!contact.name) return '?'
    const names = contact.name.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return contact.name.charAt(0).toUpperCase()
  }

  const renderContactItem = ({ item }: { item: any }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id)
    const netBalance = (item.totalOwed || 0) - (item.totalOwe || 0)
    const balanceColor = netBalance > 0 ? 'text-green-600' : netBalance < 0 ? 'text-red-600' : 'text-gray-600'

    return (
      <TouchableOpacity 
        className={`flex-row items-center overflow-hidden flex-wrap p-4 mb-3 rounded-2xl ${isSelected ? 'bg-teal-50 border border-teal-200' : 'bg-white border border-gray-100'} shadow-sm`}
        onPress={() => router.push(`/contact/${item.id}`)}
      >
        <View className="mr-4">
          <Avatar className="bg-teal-100 w-14 h-14" alt='contact avatar'>
            <AvatarFallback>
              <Text className="font-bold text-teal-800 text-lg">{getContactInitials(item)}</Text>
            </AvatarFallback>
          </Avatar>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-bold text-gray-900 text-lg">{item.name || 'No Name'}</Text>
              {item.phone && (
                <Text className="text-gray-500">{item.phone}</Text>
              )}
            </View>
            <View className="items-end">
              <Text className={`font-bold ${balanceColor}`}>
                {netBalance > 0 ? '+' : ''}KSh. {Math.abs(netBalance).toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-xs">
                {item.debtCount || 0} debt{item.debtCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
        
        {isSelected && (
          <View className="justify-center items-center bg-teal-500 ml-2 rounded-full w-6 h-6">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color="#0d9488" />
          <Text className="mt-4 text-gray-500">Loading contacts...</Text>
        </View>
      )
    }

    if (contacts.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-5 py-10">
          <View className="justify-center items-center bg-gray-100 mb-4 rounded-full w-20 h-20">
            <Ionicons name="people-outline" size={36} color="#9ca3af" />
          </View>
          <Text className="mt-4 font-medium text-gray-800 text-lg">No contacts found</Text>
          <Text className="mt-2 text-gray-500 text-center">
            Add contacts to start tracking debts
          </Text>
        </View>
      )
    }

    if (filteredContacts.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-5 py-10">
          <View className="justify-center items-center bg-gray-100 mb-4 rounded-full w-20 h-20">
            <Ionicons name="search-outline" size={36} color="#9ca3af" />
          </View>
          <Text className="mt-4 font-medium text-gray-800 text-lg">No matches found</Text>
          <Text className="mt-2 text-gray-500 text-center">
            No contacts match your search query
          </Text>
        </View>
      )
    }

    return null
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm px-5 pt-12 pb-6">
        <Text className="mb-4 font-bold text-gray-800 text-3xl">Your Contacts</Text>
        <Text className="mb-4 text-gray-600">Manage your contacts and track debts</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
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
        <View className="flex-row justify-between items-center bg-teal-50 mx-5 mt-2 px-5 py-4 rounded-xl">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#0d9488" className="mr-2" />
            <Text className="font-medium text-teal-800">
              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedContacts([])}>
            <Text className="font-medium text-teal-600">Clear</Text>
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
      />


    </View>
  )
}