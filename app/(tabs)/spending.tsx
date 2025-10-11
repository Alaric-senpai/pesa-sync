// TotalSpending page
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
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

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const d = await getAllDebts()
        const c = await getAllContacts()
        if (!mounted) return
        setDebts(d || [])
        setContacts(c || [])
      } catch (err) {
        console.warn('Failed to load debts/contacts', err)
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

  return (
    <Container>
    <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={false} >
      <View className="">
        {/* Header Section */}
        <View className="my-8">
          <SectionHeader title='Debts'  hasLink={true} linkText='Add Debt' href='/debts' />
          <Text className="text-gray-600">Track and manage all your debts in one place</Text>
        </View>

        {/* Stats Summary */}
        <View className="bg-white shadow-sm mb-6 p-5 rounded-2xl">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="mb-1 text-gray-500 text-sm">Total Debts</Text>
              <Text className="font-bold text-gray-800 text-xl">{debts.length}</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="mb-1 text-gray-500 text-sm">You Owe</Text>
              <Text className="font-bold text-red-600 text-xl">
                KSh. {debts
                  .filter(d => d.direction === 'i_owe' && !d.settled)
                  .reduce((sum, debt) => sum + debt.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="mb-1 text-gray-500 text-sm">Owed to You</Text>
              <Text className="font-bold text-green-600 text-xl">
                KSh. {debts
                  .filter(d => d.direction === 'owed_to_me' && !d.settled)
                  .reduce((sum, debt) => sum + debt.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Debt List */}
        <View className="mb-24">
          <SectionHeader title='All Debts' hasLink={false} />
          
          {debts.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <View className="justify-center items-center bg-teal-100 mb-4 rounded-full w-20 h-20">
                <Ionicons name="wallet-outline" size={36} color="#0d9488" />
              </View>
              <Text className="mb-2 font-medium text-gray-800 text-lg">No debts yet</Text>
              <Text className="mb-6 text-gray-600 text-center">Add a debt to start tracking your finances</Text>
              <TouchableOpacity 
                onPress={() => router.push('/debts')}
                className="bg-teal-600 px-6 py-3 rounded-full"
              >
                <Text className="font-medium text-white">Add Your First Debt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-2">
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
      </View>
      <View className='min-h-24' />
    </ScrollView>
    </Container>
  )
}