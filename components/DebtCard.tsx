import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { format } from 'date-fns'
import { Ionicons } from '@expo/vector-icons'
import { Card, CardContent } from './ui/card'
import { router } from 'expo-router'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { UserAvatar } from '@/constants/images'
import { cn } from '@/lib/utils'

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
  
  let avatarInitial: string;

  if (contactName) {
    avatarInitial = contactName.trim().charAt(0).toUpperCase();
  } else {
    avatarInitial = "U";
  }


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
      <Card className={cn(`shadow-sm border-2 inset-2 overflow-hidden p-0 mb-4`,  borderColor)}>
        <CardContent className="p-5">
          <View className="flex-row items-center justify-normal gap-2 mb-4">
            <Avatar alt='user-avatar' className='w-14 h-14'>
              <AvatarImage source={UserAvatar}></AvatarImage>
              <AvatarFallback>
                  <Text>{avatarInitial}</Text>
              </AvatarFallback>
            </Avatar>
            
            <View className="flex-1">
              <View className='flex-row items-center justify-between'>
                  <Text className="font-bold text-gray-900 text-xl" numberOfLines={1}>
                    {contactName || `Contact #${debt.contactId}`}
                  </Text>
                  <Text className="text-gray-900 text-sm italic">{date}</Text>
              </View>
              

                <View className="flex-row items-center justify-between">
                <View className="flex-col gap-1">
                  <Text className="font-medium text-gray-700 text-xs"> {statusLabel}</Text>
                  <Text className={`${amountColor} font-bold text-md italic`} numberOfLines={1}>
                    KSh. {totalAmount.toLocaleString()}
                  </Text>
                </View>
                  <View className="flex-col gap-1">
                  <Text className="font-medium text-gray-700 text-xs">Settled Amount</Text>
                  <Text className={`${amountColor} font-bold text-md text-right italic`} numberOfLines={1}>
                    KSh. {paidAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
          </View>
          
          </View>

        </CardContent>
      </Card>
    </TouchableOpacity>
  )
}