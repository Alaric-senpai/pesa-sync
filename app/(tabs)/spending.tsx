import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SectionHeader from '@/components/SectionHeader'
import { dummyTransactions } from '@/types/transactions'
import TransactionCard from '@/components/TransactionCard'

export default function TotalSpending() {
  return (
    <ScrollView className='flex-1 mb-28'>
        <View className='w-11/12 mx-auto my-4 '>
            <SectionHeader title='Total Spending' hasLink={true} href='/search' linkText='Search records'  />
        </View>

        {dummyTransactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)}
    </ScrollView>
  )
}