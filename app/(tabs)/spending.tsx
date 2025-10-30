import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SectionHeader from '@/components/SectionHeader'
import DebtCard from '@/components/DebtCard'
import { getAllDebts } from '@/lib/actions/debt.actions'
import { getAllContacts } from '@/lib/actions/contacts.actions'
import { settleDebt } from '@/lib/actions/debt.actions'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Container from '@/components/Container'

export default function TotalSpending() {
  const [debts, setDebts] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const d = await getAllDebts()
        const c = await getAllContacts()
        if (!mounted) return
        setDebts(d || [])
        setContacts(c || [])
      } catch (err) {
        console.warn('Failed to load debts/contacts', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const findContactName = (contactId?: number) => {
    if (!contactId) return undefined
    const c = contacts.find(x => x.id === contactId)
    return c ? c.name : undefined
  }

  // Calculate summary statistics
  const totalDebts = debts.length
  const totalOwed = debts
    .filter(d => d.direction === 'i_owe' && !d.settled)
    .reduce((sum, debt) => sum + debt.amount, 0)
  const totalOwedToMe = debts
    .filter(d => d.direction === 'owed_to_me' && !d.settled)
    .reduce((sum, debt) => sum + debt.amount, 0)
  const netBalance = totalOwedToMe - totalOwed

  if (loading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0d9488" />
          <Text className="mt-4 text-gray-600">Loading your finances...</Text>
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <ScrollView className="flex-1 mb-28" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="bg-teal-600 pt-12 pb-8 px-5">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-white text-3xl font-bold mb-1">Debt Tracker</Text>
              <Text className="text-teal-100">Manage your financial relationships</Text>
            </View>
            <TouchableOpacity 
              className="bg-teal-500 p-2 rounded-full"
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="person-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Net Balance Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-gray-600 mb-2">Net Balance</Text>
            <Text className={`text-3xl font-bold mb-4 ${netBalance >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {netBalance >= 0 ? '+' : ''}KSh. {Math.abs(netBalance).toLocaleString()}
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-500 text-sm">You're owed</Text>
                <Text className="text-gray-900 font-medium">KSh. {totalOwedToMe.toLocaleString()}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-sm">You owe</Text>
                <Text className="text-gray-900 font-medium">KSh. {totalOwed.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Summary Section */}
      <View className="px-5 mt-6">
        <View className="bg-white shadow-sm rounded-2xl p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-gray-800 text-lg">Overview</Text>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => router.push('/debts')}
            >
              <Text className="text-teal-600 mr-1">Add Debt</Text>
              <Ionicons name="add-circle-outline" size={18} color="#0d9488" />
            </TouchableOpacity>
          </View>
          
          {/* Stats Grid - More Mobile Friendly */}
          <View className="space-y-4">
            {/* Total Debts - Full Width */}
            <View className="items-center p-4 bg-teal-50 rounded-xl">
              <Text className="text-gray-600 text-sm mb-1">Total Debts</Text>
              <Text className="font-bold text-gray-800 text-2xl">{totalDebts}</Text>
            </View>
            
            {/* Financial Stats - Two Column */}
            <View className="flex-row space-x-4">
              <View className="flex-1 items-center p-4 bg-red-50 rounded-xl">
                <Text className="text-gray-600 text-sm mb-1">You Owe</Text>
                <Text className="font-bold text-red-500 text-xl">
                  KSh. {totalOwed.toLocaleString()}
                </Text>
              </View>
              <View className="flex-1 items-center p-4 bg-green-50 rounded-xl">
                <Text className="text-gray-600 text-sm mb-1">Owed to You</Text>
                <Text className="font-bold text-green-600 text-xl">
                  KSh. {totalOwedToMe.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

        {/* Debt List Section */}
        <View className="px-5 mt-6 mb-24">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-gray-900 text-xl">All Debts</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-500 mr-1">{totalDebts} debts</Text>
              <Ionicons name="filter-outline" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {totalDebts === 0 && !loading ? (
            <View className="bg-white rounded-2xl shadow-sm p-8">
              <View className="flex-col items-center">
                <View className="justify-center items-center bg-teal-100 mb-4 rounded-full w-20 h-20">
                  <Ionicons name="wallet-outline" size={36} color="#0d9488" />
                </View>
                <Text className="mb-2 font-medium text-gray-800 text-lg">No debts yet</Text>
                <Text className="mb-6 text-gray-600 text-center">Add a debt to start tracking your finances</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/debts')}
                  className="bg-teal-600 px-6 py-3 rounded-full flex-row items-center"
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" className="mr-2" />
                  <Text className="font-medium text-white">Add Your First Debt</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="gap-2">
              {debts.map((debt) => (
                <DebtCard 
                  key={debt.id} 
                  debt={debt} 
                  contactName={findContactName(debt.contactId)} 
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </Container>
  )
}