import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/context/GlobalContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo, UserAvatar } from '@/constants/images'
import { Icon } from '@/components/ui/icon'
import { ChevronRight, Plus, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react-native'
import { Link } from 'expo-router'
import { dummyTransactions } from '@/types/transactions'
import TransactionCard from '@/components/TransactionCard'
import { LinearGradient } from 'expo-linear-gradient'
import SectionHeader from '@/components/SectionHeader'
import { THEME } from '@/lib/theme'

const spendingCategories = [
  { id: '1', name: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: '2', name: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#FFD166' },
  { id: '4', name: 'Entertainment', icon: 'film', color: '#6A0572' },
  { id: '5', name: 'Health', icon: 'heart', color: '#1A936F' },
  { id: '6', name: 'Utilities', icon: 'zap', color: '#114B5F' },
  { id: '7', name: 'Education', icon: 'book', color: '#F45B69' },
  { id: '8', name: 'Travel', icon: 'map-pin', color: '#2A9D8F' },
  { id: '9', name: 'Gifts', icon: 'gift', color: '#E76F51' },
  { id: '10', name: 'Others', icon: 'more-horizontal', color: '#6C757D' },
];

export default function HomeScreen() {
  const [ greeting, setGreeting ] = React.useState("Good morning");

  useEffect(()=>{

    // allocate correct greetings based on time of day
    const currentHour = new Date().getHours();
    let greeting = "Good morning";

    if (currentHour >= 12 && currentHour < 18) {
      greeting = "Good afternoon";
    } else if (currentHour >= 18) {
      greeting = "Good evening";
    }
    setGreeting(greeting);

  }, [])


  const { username } = useGlobalContext()
  
  // Calculate some stats for the overview
  const totalIncome = dummyTransactions
    .filter(t => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = dummyTransactions
    .filter(t => t.type === 'sent')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <ScrollView className="flex-1 bg-gray-50  mb-28" showsVerticalScrollIndicator={false}>
      <View className="w-full p-5 flex-row justify-between items-center bg-white">
        <View>
          <Text className="text-gray-500 text-sm">{greeting},</Text>
          <Text className="text-2xl font-bold text-gray-800">{username}</Text>
        </View>
        <Avatar alt='user avatar' className='w-14 h-14 rounded-full overflow-hidden border-2 border-teal-100'>
          <AvatarImage source={UserAvatar} />
          <AvatarFallback className="bg-teal-100">
            <Text className="text-teal-800 font-bold text-lg">{username?.charAt(0).toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
      </View>

      {/* Balance Card */}
      <View className="px-5 mt-5">
        <LinearGradient
          colors={[THEME.light.primary, THEME.light.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full rounded-2xl p-6 shadow-lg"
          style={styles.balanceCard}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white/80 font-medium">Total Balance</Text>
            <Pressable className="flex-row items-center">
              <Text className="text-white text-sm mr-1">View history</Text>
              <Icon as={ChevronRight} size={16} className="text-white" />
            </Pressable>
          </View>
          
          <View className="mb-6">
            <Text className="text-white font-bold text-3xl">KSh. {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-2">
                <Icon as={TrendingUp} size={18} className="text-white" />
              </View>
              <View>
                <Text className="text-white/70 text-xs">Income</Text>
                <Text className="text-white font-semibold">KSh. {totalIncome.toLocaleString()}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-2">
                <Icon as={TrendingDown} size={18} className="text-white" />
              </View>
              <View>
                <Text className="text-white/70 text-xs">Expenses</Text>
                <Text className="text-white font-semibold">KSh. {totalExpenses.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mt-6">
        <SectionHeader title="Quick Actions" />
        <View className="flex-row justify-between">
          <Link href="/" asChild>
            <Pressable className="w-32 h-24 bg-white rounded-2xl p-4 items-center justify-center shadow-sm border border-gray-100">
              <View className="w-12 h-12 rounded-full bg-teal-100 items-center justify-center mb-2">
                <Icon as={DollarSign} size={24} className="text-teal-600" />
              </View>
              <Text className="text-gray-700 font-medium">Add Income</Text>
            </Pressable>
          </Link>
          
          <Link href="/" asChild>
            <Pressable className="w-32 h-24 bg-white rounded-2xl p-4 items-center justify-center shadow-sm border border-gray-100">
              <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-2">
                <Icon as={CreditCard} size={24} className="text-red-600" />
              </View>
              <Text className="text-gray-700 font-medium">Add Expense</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Spending Categories */}
      <View className="px-5 mt-6">
        <SectionHeader title="Spending Categories" hasLink linkText="see all" href="/spendingcategory" />

        <FlatList
          data={spendingCategories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 16 }}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => (
            <Pressable className="w-20 h-20 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100">
              <View className="w-10 h-10 rounded-full items-center justify-center mb-2" style={{ backgroundColor: `${item.color}20` }}>
                {/* <Icon as={item.icon} size={20} style={{ color: item.color }} /> */}
              </View>
              <Text className="text-gray-700 text-xs font-medium text-center">{item.name}</Text>
            </Pressable>
          )}
          ListHeaderComponent={<SpendingCategoryCreateButton />}
        />
      </View>

      {/* Recent Transactions */}
      <View className="px-5 mt-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Recent Transactions</Text>
          <Link href="/" asChild>
            <Pressable className="flex-row items-center">
              <Text className="text-teal-600 font-medium mr-1">See all</Text>
              <Icon as={ChevronRight} size={16} className="text-teal-600" />
            </Pressable>
          </Link>
        </View>
        
        <View className="bg-white ">
          {dummyTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </View>
      </View>
    </ScrollView>
  )

}

const SpendingCategoryCreateButton = () => {
  return (
    <Link href='/spendingcategory' asChild>
      <Pressable className="w-20 h-20 bg-white rounded-2xl items-center justify-center shadow-sm border border-dashed border-teal-300 mr-3">
        <View className="w-10 h-10 rounded-full items-center justify-center bg-teal-50 mb-2">
          <Icon as={Plus} size={20} className="text-teal-600" />
        </View>
        <Text className="text-teal-600 text-xs font-medium text-center">Add</Text>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  }
})