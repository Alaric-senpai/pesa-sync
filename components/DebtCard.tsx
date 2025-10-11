import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { format } from 'date-fns'
import { Ionicons } from '@expo/vector-icons'
import { Card, CardContent } from './ui/card'
import { router } from 'expo-router'

type Debt = {
  id: number
  contactId: number
  amount: number
  paid?: number
  direction: 'owed_to_me' | 'i_owe'
  reason?: string
  dueDate?: number
  settled?: number
  createdAt?: number
}

type Props = {
  debt: Debt
  contactName?: string
}

export default function DebtCard({ debt, contactName }: Props) {
  const isOwedToUser = debt.direction === 'owed_to_me'
  const statusLabel = debt.settled ? 'Settled' : (isOwedToUser ? 'Owed to you' : 'You owe')
  const amountColor = isOwedToUser ? 'text-green-600' : 'text-red-600'
  const icon = isOwedToUser ? 'arrow-down-circle' : 'arrow-up-circle'
  const iconColor = isOwedToUser ? '#16a34a' : '#ef4444'
  const date = debt.createdAt ? format(new Date(debt.createdAt * 1000), 'MMM dd, yyyy') : ''
  
  // Background colors based on debt direction
  const cardBg = isOwedToUser ? 'bg-green-50' : 'bg-red-50'
  const iconBg = isOwedToUser ? 'bg-green-100' : 'bg-red-100'
  const statusColor = isOwedToUser ? 'text-green-700' : 'text-red-700'
  const borderColor = isOwedToUser ? 'border-green-200' : 'border-red-200'

  const paidAmount = debt.paid || 0
  const totalAmount = debt.amount || 0
  const remaining = Math.max(0, totalAmount - paidAmount)

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/debt/${debt.id}`)}
      activeOpacity={0.8}
    >
      <Card className={`${cardBg} shadow-sm border ${borderColor} overflow-hidden p-0 mb-4`}>
        {/* Status indicator at top */}
        <View className={`h-1 w-full ${isOwedToUser ? 'bg-green-500' : 'bg-red-500'}`} />
        
        {/* Main content area */}
        <CardContent className="p-5">
          {/* Header with icon and contact info */}
          <View className="flex-row items-start mb-4">
            {/* Icon with background - primary visual element */}
            <View className={`${iconBg} w-14 h-14 rounded-full justify-center items-center mr-4`}>
              <Ionicons name={icon as any} size={28} color={iconColor} />
            </View>
            
            {/* Contact details */}
            <View className="flex-1">
              {/* Contact name - most important text */}
              <Text className="font-bold text-gray-900 text-xl" numberOfLines={1}>
                {contactName || `Contact #${debt.contactId}`}
              </Text>
              
              {/* Status and date - secondary information */}
              <View className="flex-row items-center mt-1">
                <Text className={`${statusColor} font-medium text-sm`}>
                  {statusLabel}
                </Text>
                <Text className="mx-2 text-gray-400">•</Text>
                <Text className="text-gray-500 text-sm">{date}</Text>
              </View>
            </View>
          </View>
          
          {/* Amount section - prominently displayed */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium text-gray-700">Total Amount</Text>
              <Text className={`${amountColor} font-bold text-2xl`} numberOfLines={1}>
                KSh. {totalAmount.toLocaleString()}
              </Text>
            </View>
            

          </View>

        </CardContent>
      </Card>
    </TouchableOpacity>
  )
}