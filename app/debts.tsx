import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Container from '@/components/Container'
import { createDebt } from '@/lib/actions/debt.actions'
import { findOrCreateContactByPhone } from '@/lib/actions/contacts.actions'
import { useGlobalContext } from '@/context/GlobalContext'
import { Button } from '@/components/ui/button'
import { useForm, Controller } from 'react-hook-form'
import * as Contacts from 'expo-contacts'
import { Toast } from 'toastify-react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { FlatList } from 'react-native'

export default function CreateDebtsPage() {
  const { currentUser, refreshAccount } = useGlobalContext()
  const [selectedContact, setSelectedContact] = useState<{ name?: string; phone?: string; appId?: number } | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [pickerContacts, setPickerContacts] = useState<Contacts.Contact[] | null>(null)
  const [pickerLoading, setPickerLoading] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<{ amount: string; direction: 'owed_to_me' | 'i_owe' }>({
    defaultValues: { amount: '', direction: 'i_owe' }
  })

  const openPicker = async () => {
    setPickerVisible(true)
    setPickerLoading(true)
    try {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status !== 'granted') {
        Toast.error('Contacts permission denied', 'bottom')
        setPickerLoading(false)
        return
      }
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers], sort: Contacts.SortTypes.FirstName })
      setPickerContacts(data)
    } catch (e) {
      console.warn('Failed to load contacts', e)
      Toast.error('Failed to load contacts', 'bottom')
    } finally {
      setPickerLoading(false)
    }
  }

  const selectDeviceContact = async (c: Contacts.Contact) => {
    // pick first phone number
    const phone = c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : undefined
    if (!phone) {
      Toast.error('Selected contact has no phone number', 'bottom')
      return
    }
    try {
      const appContact = await findOrCreateContactByPhone(phone, c.name)
      setSelectedContact({ name: appContact.name, phone: appContact.phone, appId: appContact.id })
      setPickerVisible(false)
    } catch (e) {
      console.warn('Failed to save contact to app DB', e)
      Toast.error('Failed to save contact', 'bottom')
    }
  }

  const onCreate = async (values: { amount: string; direction: 'owed_to_me' | 'i_owe' }) => {
    if (!currentUser) {
      Toast.error('No logged-in user', 'bottom')
      return
    }
    if (!selectedContact?.appId) {
      Toast.error('Please choose a contact', 'bottom')
      return
    }
    const amt = Number(values.amount)
    if (!amt || amt <= 0) {
      Toast.error('Enter a valid amount', 'bottom')
      return
    }
    try {
      await createDebt({ userId: currentUser.id, contactId: selectedContact.appId, amount: amt, direction: values.direction })
      Toast.success('Debt recorded', 'bottom')
      reset()
      setSelectedContact(null)
      await refreshAccount() // Refresh account balances after creating debt
      // Redirect to tabs after successful creation
      router.replace('/(tabs)')
    } catch (e) {
      console.error('Create debt error', e)
      Toast.error('Failed to create debt', 'bottom')
    }
  }

  return (
    <Container >
      <View className="px-5 pt-12">
        <View className="mb-6">
          <Text className="font-bold text-gray-800 text-3xl">Register Debt</Text>
          <Text className="mt-1 text-gray-600">Add a new debt to track</Text>
        </View>

        <View className="bg-white shadow-sm p-5 rounded-2xl">
          <Text className="mb-4 font-semibold text-gray-800 text-lg">Debt Details</Text>

          <TouchableOpacity 
            onPress={openPicker} 
            className="flex-row justify-between items-center bg-gray-100 mb-4 p-4 rounded-xl"
          >
            <Text className={selectedContact ? "text-gray-800" : "text-gray-500"}>
              {selectedContact ? `${selectedContact.name} • ${selectedContact.phone}` : 'Choose contact...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>

          <Controller 
            control={control} 
            name="amount" 
            rules={{ required: true }} 
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput 
                  value={value} 
                  onChangeText={onChange} 
                  placeholder="Amount" 
                  keyboardType="numeric" 
                  className="bg-gray-100 mb-2 p-4 rounded-xl text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                {errors.amount && <Text className="mb-2 text-red-500">Amount is required</Text>}
              </View>
            )} 
          />

          <View className="mb-4">
            <Text className="mb-2 text-gray-700">Direction</Text>
            <View className="flex-row">
              <Controller 
                control={control} 
                name="direction" 
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity 
                      onPress={() => onChange('i_owe')} 
                      className={`flex-1 py-3 rounded-l-xl mr-1 ${value === 'i_owe' ? 'bg-teal-600' : 'bg-gray-100'}`}
                    >
                      <Text className={`text-center font-medium ${value === 'i_owe' ? 'text-white' : 'text-gray-800'}`}>I owe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => onChange('owed_to_me')} 
                      className={`flex-1 py-3 rounded-r-xl ml-1 ${value === 'owed_to_me' ? 'bg-teal-600' : 'bg-gray-100'}`}
                    >
                      <Text className={`text-center font-medium ${value === 'owed_to_me' ? 'text-white' : 'text-gray-800'}`}>Owed to me</Text>
                    </TouchableOpacity>
                  </>
                )} 
              />
            </View>
          </View>

          <Button 
            onPress={handleSubmit(onCreate)} 
            className="bg-teal-600 rounded-xl min-h-14"
          >
            <Text className="font-semibold text-white text-center">Create Debt</Text>
          </Button>
        </View>
      </View>
      <ContactPickerModal visible={pickerVisible} contacts={pickerContacts} loading={pickerLoading} onSelect={selectDeviceContact} onClose={() => setPickerVisible(false)} />
    </Container>
  )
}

// Contact picker modal at end of file
function ContactPickerModal({ visible, contacts, loading, onSelect, onClose }: { visible: boolean; contacts: Contacts.Contact[] | null; loading: boolean; onSelect: (c: Contacts.Contact) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const filtered = contacts ? contacts.filter(c => (c.name || '').toLowerCase().includes(query.toLowerCase()) || (c.phoneNumbers && c.phoneNumbers.some(p => !!p.number && p.number.includes(query)))) : []

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <Container >
        <View className="px-5 pt-12">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-bold text-gray-800 text-2xl">Choose Contact</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View className="relative mb-4">
            <Ionicons name="search" size={20} color="#9ca3af" className="top-1/2 left-4 z-10 absolute -mt-2.5" />
            <TextInput 
              value={query} 
              onChangeText={setQuery} 
              placeholder="Search contacts" 
              className="bg-gray-100 py-4 pr-4 pl-12 rounded-xl text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0d9488" />
              <Text className="mt-4 text-gray-600">Loading contacts...</Text>
            </View>
          ) : (
            <FlatList 
              data={filtered} 
              keyExtractor={(item, idx) => idx.toString()} 
              renderItem={({ item }: { item: Contacts.Contact }) => (
                <TouchableOpacity 
                  onPress={() => onSelect(item)} 
                  className="flex-row items-center py-4 border-gray-100 border-b"
                >
                  <View className="justify-center items-center bg-teal-100 mr-4 rounded-full w-12 h-12">
                    <Text className="font-semibold text-teal-800">{item.name?.charAt(0) || '?'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.phoneNumbers && item.phoneNumbers[0]?.number}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )} 
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-10">
                  <Ionicons name="people-outline" size={48} color="#d1d5db" />
                  <Text className="mt-4 text-gray-500 text-center">No contacts found</Text>
                </View>
              }
            />
          )}
        </View>
      </Container>
    </Modal>
  )
}