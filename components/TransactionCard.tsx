import { View, Text } from 'react-native'
import React from 'react'
import { Transaction } from '@/types/transactions'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'

type Props = {
    transaction: Transaction
}

export default function TransactionCard({ transaction }: Props) {

      const formattedDate = format(new Date(transaction.date), 'MMM dd, yyyy • hh:mm a');

  const isSent = transaction.type === 'sent';
  const amountColor = isSent ? 'text-red-300' : 'text-green-500';
  const iconName = isSent ? 'arrow-up-circle' : 'arrow-down-circle';
  const iconColor = isSent ? '#ef4444' : '#22c55e';
  const bgColor = isSent ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isSent ? 'border-red-100' : 'border-green-100';

  return (
    <View className={`w-full p-4 rounded-2xl mb-3 ${bgColor} border ${borderColor} shadow-sm`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <View className="mr-3">
            <Ionicons name={iconName} size={24} color={iconColor} />
          </View>
          <View>
            <Text className="font-bold text-gray-800 text-lg">{transaction.sender}</Text>
            <Text className="text-gray-500 text-sm">{formattedDate}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className={`font-bold text-xl ${amountColor}`}>
            {isSent ? '-' : '+'} KSh. {transaction.amount.toLocaleString()}
          </Text>
          <View className={`mt-1 px-2 py-1 rounded-full ${isSent ? 'bg-red-100' : 'bg-green-100'}`}>
            <Text className={`text-xs font-medium ${isSent ? 'text-red-600' : 'text-green-600'}`}>
              {isSent ? 'Sent' : 'Received'}
            </Text>
          </View>
        </View>
      </View>
      
      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row justify-between">
          <Text className="text-gray-500 text-sm">Transaction ID</Text>
          <Text className="text-gray-700 text-sm font-medium">{transaction.id}</Text>
        </View>
        {transaction.reference && (
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-500 text-sm">Reference</Text>
            <Text className="text-gray-700 text-sm font-medium">{transaction.reference}</Text>
          </View>
        )}
      </View>
    </View>
  )
}