import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Container from '@/components/Container'
import { getContactById } from '@/lib/actions/contacts.actions'
import { getDebtsForContact } from '@/lib/actions/debt.actions'
import DebtCard from '@/components/DebtCard'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'

export default function ContactDetail() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const id = Number(params.id)

  const [contact, setContact] = useState<any | null>(null)
  const [debts, setDebts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      if (!id) return
      const c = await getContactById(id)
      setContact(c || null)
      const d = await getDebtsForContact(id)
      setDebts((d as any[]) || [])
    } catch (e) {
      console.warn('Failed to load contact detail', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading) return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className="mt-4 text-gray-600">Loading contact...</Text>
      </View>
    </Container>
  )

  if (!contact) return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Contact not found</Text>
      </View>
    </Container>
  )

  // Calculate debt summary. Use remaining = max(0, amount - paid) and ignore already settled
  // debts when summing outstanding amounts. Also compute principal and paid totals for context.
  const outstandingDebts = debts.filter(d => d.settled === 0)

  const totalOwedRemaining = outstandingDebts
    .filter(d => d.direction === 'owed_to_me')
    .reduce((sum, debt) => sum + Math.max(0, (debt.amount || 0) - (debt.paid || 0)), 0)

  const totalOweRemaining = outstandingDebts
    .filter(d => d.direction === 'i_owe')
    .reduce((sum, debt) => sum + Math.max(0, (debt.amount || 0) - (debt.paid || 0)), 0)

  // Totals for principal and paid (all debts)
  const totalPrincipalOwed = debts
    .filter(d => d.direction === 'owed_to_me')
    .reduce((sum, debt) => sum + (debt.amount || 0), 0)

  const totalPrincipalOwe = debts
    .filter(d => d.direction === 'i_owe')
    .reduce((sum, debt) => sum + (debt.amount || 0), 0)

  const totalPaid = debts.reduce((sum, debt) => sum + (debt.paid || 0), 0)

  const netBalance = totalOwedRemaining - totalOweRemaining
  const netBalanceColor = netBalance > 0 ? 'text-green-600' : netBalance < 0 ? 'text-red-600' : 'text-gray-600'

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-12 pb-24">
          {/* Header with back button and title */}
          <View className="flex-row justify-between items-center mb-8">
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="justify-center items-center bg-white shadow-sm mr-4 rounded-full w-12 h-12"
              >
                <Ionicons name="arrow-back" size={24} color="#4b5563" />
              </TouchableOpacity>
              <Text className="font-bold text-gray-800 text-3xl">
                  {contact.name ? contact.name : 'Contact'}

              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-vertical" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <View className="bg-white shadow-md mb-6 p-6 rounded-3xl">
            <View className="flex-row items-center mb-6">
              <View className="justify-center items-center bg-gradient-to-br from-teal-400 to-teal-600 shadow-md mr-5 rounded-full w-20 h-20">
                <Text className="font-bold text-white text-3xl">
                  {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-3xl">{contact.name}</Text>
                {contact.phone && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="call-outline" size={16} color="#6b7280" className="mr-1" />
                    <Text className="text-gray-600">{contact.phone}</Text>
                  </View>
                )}
                {contact.createdAt && (
                  <Text className="mt-1 text-gray-400 text-sm">
                    Added {format(new Date(contact.createdAt * 1000), 'MMM dd, yyyy')}
                  </Text>
                )}
              </View>
            </View>
            
            {/* Net balance card */}
            <View className="bg-gray-50 p-5 rounded-2xl">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-medium text-gray-600">Net Balance (Outstanding)</Text>
                <Text className={`font-bold text-xl ${netBalanceColor}`}>
                  {netBalance > 0 ? '+' : ''}KSh. {Math.abs(netBalance).toLocaleString()}
                </Text>
              </View>

              <View className="flex-col justify-between mb-3">
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center">
                    <View className="bg-green-500 mr-2 rounded-full w-3 h-3"></View>
                    <Text className="text-gray-600 text-sm">Owed to you (outstanding)</Text>
                  </View>
                  <Text className="ml-5 font-bold text-green-600 text-lg">
                    KSh. {totalOwedRemaining.toLocaleString()}
                  </Text>
                  <Text className="ml-5 text-gray-500 text-sm">Principal: KSh. {totalPrincipalOwed.toLocaleString()} · Paid: KSh. {((totalPrincipalOwed - totalOwedRemaining)).toLocaleString()}</Text>
                </View>

                <View className="bg-gray-200 w-px h-16"></View>

                <View className="flex-1 pl-2">
                  <View className="flex-row items-center">
                    <View className="bg-red-500 mr-2 rounded-full w-3 h-3"></View>
                    <Text className="text-gray-600 text-sm">You owe (outstanding)</Text>
                  </View>
                  <Text className="ml-5 font-bold text-red-600 text-lg">
                    KSh. {totalOweRemaining.toLocaleString()}
                  </Text>
                  <Text className="ml-5 text-gray-500 text-sm">Principal: KSh. {totalPrincipalOwe.toLocaleString()} · Paid: KSh. {((totalPrincipalOwe - totalOweRemaining)).toLocaleString()}</Text>
                </View>
              </View>

              <View className="pt-3 border-gray-200 border-t">
                <Text className="text-gray-500 text-sm">Total paid across all debts: <Text className="font-medium text-gray-800">KSh. {totalPaid.toLocaleString()}</Text></Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row space-x-3 mb-6">
            <TouchableOpacity className="flex-row flex-1 justify-center items-center bg-white shadow-sm py-4 rounded-2xl">
              <Ionicons name="call-outline" size={20} color="#0d9488" />
              <Text className="ml-2 font-medium text-gray-800">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row flex-1 justify-center items-center bg-white shadow-sm py-4 rounded-2xl">
              <Ionicons name="mail-outline" size={20} color="#0d9488" />
              <Text className="ml-2 font-medium text-gray-800">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row flex-1 justify-center items-center bg-white shadow-sm py-4 rounded-2xl">
              <Ionicons name="add-circle-outline" size={20} color="#0d9488" />
              <Text className="ml-2 font-medium text-gray-800">Add Debt</Text>
            </TouchableOpacity>
          </View>

          {/* Debts section */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-gray-900 text-xl">Debts</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="mr-1 text-gray-500">{debts.length} debts</Text>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {debts.length === 0 ? (
              <View className="bg-white shadow-sm p-8 rounded-2xl">
                <View className="flex-col items-center">
                  <View className="justify-center items-center bg-gray-100 mb-4 rounded-full w-16 h-16">
                    <Ionicons name="wallet-outline" size={28} color="#9ca3af" />
                  </View>
                  <Text className="mb-2 font-medium text-gray-800 text-lg">No debts yet</Text>
                  <Text className="mb-6 text-gray-500 text-center">Add a debt to start tracking with this contact</Text>
                  <TouchableOpacity className="bg-teal-600 px-6 py-3 rounded-full">
                    <Text className="font-medium text-white">Add First Debt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                {debts.map(d => (
                  <DebtCard key={d.id} debt={d} contactName={contact.name} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}