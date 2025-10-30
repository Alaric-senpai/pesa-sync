import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Container from '@/components/Container'
import { getAllDebts, payDebt, settleDebt, deleteDebt } from '@/lib/actions/debt.actions'
import { getPaymentsForDebt } from '@/lib/actions/payment.actions'
import { getContactById } from '@/lib/actions/contacts.actions'
import { Toast } from 'toastify-react-native'
import { useGlobalContext } from '@/context/GlobalContext'
import { Debt, Payment, Contact } from '@/types/debts'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'

export default function DebtDetail(): React.ReactElement {
  const params = useLocalSearchParams()
  const router = useRouter()
  const { currentUser, refreshAccount, applyPaymentOptimistic } = useGlobalContext()
  const id = Number(params.id)

  const [debt, setDebt] = useState<Debt | null>(null)
  const [contact, setContact] = useState<any>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [payModalVisible, setPayModalVisible] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [note, setNote] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const all = await getAllDebts()
      const found = (all as Debt[]).find((d: Debt) => d.id === id)
      setDebt(found || null)
      
      if (found && found.contactId) {
        const contactData = await getContactById(found.contactId)
        setContact(contactData || null)
      }
      
      const p = await getPaymentsForDebt(id)
      setPayments((p as Payment[]) || [])
    } catch (e) {
      console.warn('Failed to load debt detail', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const onSubmitPayment = async () => {
    const amt = Number(payAmount)
    if (!isFinite(amt) || amt <= 0) { 
      Toast.error('Enter a valid amount'); 
      return 
    }
  // Apply optimistic update to global account balances so the UI updates immediately.
  const revert = debt ? applyPaymentOptimistic(debt.direction, amt) : () => {}
    try {
      await payDebt({ debtId: id, userId: currentUser?.id || 1, amount: amt, evidenceMessage: note })
      Toast.success('Payment recorded')
      setPayModalVisible(false)
      // Refresh local view
      await load()
      // Refresh global account balances to ensure eventual consistency with DB
      try { if (refreshAccount) await refreshAccount() } catch (err) { console.warn('refreshAccount failed', err) }
    } catch (e) {
      // Revert optimistic update on failure
      try { revert && revert() } catch (re) { console.warn('revert failed', re) }
      console.warn('Payment failed', e)
      Toast.error(e instanceof Error ? e.message : 'Payment failed')
    }
  }

  const onSettle = async () => {
  // Settlement may create a final payment; optimistically apply the remaining amount
  const remaining = debt ? Math.max(0, (debt.amount || 0) - (debt.paid || 0)) : 0
  const revertSettle = debt ? applyPaymentOptimistic(debt.direction, remaining) : () => {}
    try {
      await settleDebt(id, currentUser?.id || 1)
      Toast.success('Debt settled')
      // Refresh local view
      await load()
      // Refresh global balances
      try { if (refreshAccount) await refreshAccount() } catch (err) { console.warn('refreshAccount failed', err) }
    } catch (e) {
      // revert optimistic update
      try { revertSettle && revertSettle() } catch (re) { console.warn('revert failed', re) }
      console.warn('Settle failed', e)
      Toast.error(e instanceof Error ? e.message : 'Failed to settle debt')
    }
  }

  const onDelete = async () => {
    // Check if debt can be deleted
    if (settledFlag || remaining <= 0 || payments.length > 1) {
      Alert.alert(
        'Cannot Delete Debt',
        'This debt cannot be deleted because it has multiple payments or is already settled.',
        [{ text: 'OK', style: 'cancel' }]
      )
      return
    }
    
    Alert.alert('Delete debt', 'Are you sure you want to delete this debt and all related records?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteDebt(id, currentUser?.id || 1)
          Toast.success('Debt deleted')
          // Refresh global balances then navigate home
          try { if (refreshAccount) await refreshAccount() } catch (err) { console.warn('refreshAccount failed', err) }
          router.replace('/')
        } catch (e) {
          console.warn('Delete failed', e)
          Toast.error(e instanceof Error ? e.message : 'Failed to delete debt')
        }
      } }
    ])
  }

  if (!debt) return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className="mt-4 text-gray-600">Loading debt details...</Text>
      </View>
    </Container>
  )

  const remaining = Math.max(0, (debt.amount || 0) - (debt.paid || 0))
  const progressPercentage = debt.amount > 0 ? Math.min(100, (Number(debt.paid || 0) / Number(debt.amount)) * 100) : 0
  const isOwedToUser = debt.direction === 'owed_to_me'
  const statusColor = isOwedToUser ? 'text-green-600' : 'text-red-600'
  const progressColor = isOwedToUser ? 'bg-green-500' : 'bg-red-500'
  const badgeColor = isOwedToUser ? 'bg-green-100' : 'bg-red-100'
  const badgeTextColor = isOwedToUser ? 'text-green-800' : 'text-red-800'
  
  // Normalize settled flag (stored as 0|1 or boolean in DB) and determine if fully settled
  const settledFlag = debt.settled === 1 || debt.settled === true
  const isFullySettled = settledFlag || remaining <= 0

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-12 pb-24">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="justify-center items-center bg-white shadow-sm mr-4 rounded-full w-10 h-10"
              >
                <Ionicons name="arrow-back" size={22} color="#4b5563" />
              </TouchableOpacity>
              <Text className="font-bold text-gray-800 text-2xl">Debt Details</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${badgeColor}`}>
              <Text className={`font-medium text-sm ${badgeTextColor}`}>
                {isOwedToUser ? 'Owed to you' : 'You owe'}
              </Text>
            </View>
          </View>

          {/* Contact Card */}
          <View className="bg-white shadow-sm mb-6 p-5 rounded-2xl">
            <View className="flex-row items-center">
              <View className="justify-center items-center bg-teal-100 mr-4 rounded-full w-14 h-14">
                <Ionicons name="person" size={24} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-xl">
                  {contact ? contact.name : `Contact #${debt.contactId}`}
                </Text>
                {contact?.phone && (
                  <Text className="text-gray-500">{contact.phone}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Debt Summary */}
          <View className="bg-white shadow-sm mb-6 p-5 rounded-2xl">
            <Text className="mb-4 font-bold text-gray-900 text-lg">Debt Summary</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="font-bold text-gray-900 text-lg">KSh. {Number(debt.amount).toLocaleString()}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Paid</Text>
                <Text className="font-bold text-gray-900">KSh. {Number(debt.paid || 0).toLocaleString()}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Remaining</Text>
                <Text className={`font-bold text-lg ${statusColor}`}>KSh. {remaining.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Progress */}
          <View className="bg-white shadow-sm mb-6 p-5 rounded-2xl">
            <Text className="mb-4 font-bold text-gray-900 text-lg">Payment Progress</Text>
            
            <View className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600">Completion</Text>
                <Text className="font-medium text-gray-600">{progressPercentage.toFixed(0)}%</Text>
              </View>
              <View className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <View 
                  className={`h-full ${progressColor}`} 
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
            </View>
            
            <View className="flex-row justify-between mt-4">
              <View>
                <Text className="text-gray-500 text-sm">Status</Text>
                <Text className={`font-medium ${statusColor}`}>
                  {settledFlag ? 'Settled' : remaining > 0 ? 'Partially Paid' : 'Fully Paid'}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-sm">Created</Text>
                <Text className="text-gray-800">
                  {debt.createdAt ? format(new Date(debt.createdAt * 1000), 'MMM dd, yyyy') : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="bg-white shadow-sm mb-6 p-5 rounded-2xl">
            <Text className="mb-4 font-bold text-gray-900 text-lg">Actions</Text>
            
            <View className="space-y-3">
              {/* Only show Add Payment if debt is not fully settled */}
              {!isFullySettled && (
                <TouchableOpacity 
                  onPress={() => setPayModalVisible(true)} 
                  className="flex-row justify-center items-center bg-white border border-gray-200 py-3 rounded-xl"
                >
                  <Ionicons name="cash-outline" size={20} color="#4b5563" />
                  <Text className="ml-2 font-medium text-gray-800">Add Payment</Text>
                </TouchableOpacity>
              )}
              
              {/* Only show Settle if debt is not fully settled */}
              {!isFullySettled && (
                <TouchableOpacity 
                  onPress={onSettle} 
                  className="flex-row justify-center items-center bg-teal-600 py-3 rounded-xl"
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                  <Text className="ml-2 font-medium text-white">Settle</Text>
                </TouchableOpacity>
              )}
              
              {/* Show message if debt is settled */}
              {isFullySettled && (
                <Text className="text-gray-500 text-center py-2">This debt is fully settled</Text>
              )}
              
              {/* Delete button - always visible but disabled if not allowed */}
              <TouchableOpacity 
                onPress={onDelete} 
                disabled={settledFlag || remaining <= 0 || payments.length > 1}
                className={`flex-row justify-center items-center py-3 rounded-xl ${
                  settledFlag || remaining <= 0 || payments.length > 1 
                    ? 'bg-gray-200' 
                    : 'bg-red-600'
                }`}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={20} 
                  color={settledFlag || remaining <= 0 || payments.length > 1 ? "#9ca3af" : "white"} 
                />
                <Text className={`ml-2 font-medium ${
                  settledFlag || remaining <= 0 || payments.length > 1 
                    ? 'text-gray-500' 
                    : 'text-white'
                }`}>
                  Delete
                </Text>
              </TouchableOpacity>
              
              {/* Show reason why delete is disabled */}
              {(settledFlag || remaining <= 0 || payments.length > 1) && (
                <Text className="text-gray-400 text-xs text-center">
                  This debt cannot be deleted because it has multiple payments or is already settled
                </Text>
              )}
            </View>
          </View>

          {/* Payments */}
          <View className="bg-white shadow-sm p-5 rounded-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-gray-900 text-lg">Payments</Text>
              <Text className="text-gray-500">{payments.length} payments</Text>
            </View>
            
            {payments.length === 0 ? (
              <View className="flex-col items-center py-8">
                <View className="justify-center items-center bg-gray-100 mb-4 rounded-full w-16 h-16">
                  <Ionicons name="receipt-outline" size={24} color="#9ca3af" />
                </View>
                <Text className="text-gray-500">No payments recorded</Text>
                <Text className="mt-1 text-gray-400 text-sm">Add a payment to get started</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {payments.map(p => (
                  <View key={p.id} className="bg-gray-50 p-4 rounded-xl">
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="font-bold text-gray-900 text-lg">KSh. {Number(p.amount).toLocaleString()}</Text>
                        <Text className="text-gray-500">
                          {p.createdAt ? format(new Date(p.createdAt * 1000), 'MMM dd, yyyy • h:mm a') : ''}
                        </Text>
                      </View>
                      <View className="items-end">
                        <View className="bg-gray-200 mb-1 px-2 py-1 rounded-full">
                          <Text className="text-gray-700 text-xs">{p.method || 'manual'}</Text>
                        </View>
                        {p.note && (
                          <Text className="mt-1 text-gray-500 text-sm">{p.note}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal visible={payModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-bold text-gray-900 text-2xl">Add Payment</Text>
              <TouchableOpacity onPress={() => setPayModalVisible(false)} className="p-2">
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View className="bg-gray-50 mb-6 p-4 rounded-xl">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Total Debt</Text>
                <Text className="font-medium">KSh. {Number(debt.amount).toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Already Paid</Text>
                <Text className="font-medium">KSh. {Number(debt.paid || 0).toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-medium text-gray-600">Remaining</Text>
                <Text className={`font-bold ${statusColor}`}>KSh. {remaining.toLocaleString()}</Text>
              </View>
            </View>
            
            <Text className="mb-2 font-medium text-gray-700">Payment Amount</Text>
            <View className="relative mb-6">
              <Text className="absolute top-4 left-4 text-gray-500">KSh.</Text>
              <TextInput 
                value={payAmount} 
                onChangeText={setPayAmount} 
                placeholder="0.00"
                keyboardType="numeric" 
                className="bg-gray-100 py-4 pr-4 pl-12 rounded-xl text-gray-800 text-lg"
              />
            </View>
            
            <Text className="mb-2 font-medium text-gray-700">Note (Optional)</Text>
            <TextInput 
              value={note} 
              onChangeText={setNote} 
              placeholder="Add a note about this payment"
              multiline
              numberOfLines={3}
              className="bg-gray-100 mb-8 p-4 rounded-xl text-gray-800"
              textAlignVertical="top"
            />
            
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={() => setPayModalVisible(false)} 
                className="flex-1 bg-gray-100 py-4 rounded-xl"
              >
                <Text className="font-medium text-gray-700 text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onSubmitPayment} 
                className="flex-1 bg-teal-600 py-4 rounded-xl"
              >
                <Text className="font-medium text-white text-center">Submit Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  )
}