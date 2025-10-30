import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import Container from '@/components/Container'
import  { Toast } from 'toastify-react-native'
import { getAllContacts, getAllDebts } from '@/lib/actions'
import DebtCard from '@/components/DebtCard'



export default function HomeScreen() {
  const { defaultAccount } = useGlobalContext()
  const [ greeting, setGreeting ] = React.useState("Good morning");
  const [debts, setDebts] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const d = await getAllDebts()
        const c = await getAllContacts()
        if (!mounted) return
        setDebts((d && d.length) ? d.slice(0, 5) : [])
        setContacts(c || [])
      } catch (err) {
        console.warn('Failed to load debts/contacts', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

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



  const { currentUser } = useGlobalContext()
  
  // Calculate some stats for the overview
  const totalIncome = defaultAccount?.incomeAmount || 0;

  const totalDebted = defaultAccount?.debtAmount || 0;

  const amountOwed = defaultAccount?.DebtedAmount || 0;

  const balance = (totalIncome + amountOwed) - totalDebted;

  return (
    <Container>
    <ScrollView className="flex-1 bg-gray-50 mb-28" showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center bg-white p-5 w-full">
        <View>
          <Text className="text-gray-500 text-sm">{greeting},</Text>
          <Text className="font-bold text-gray-800 text-2xl">{currentUser?.username || 'User'}</Text>
        </View>
        <Avatar alt='user avatar' className='border-2 border-teal-100 rounded-full w-14 h-14 overflow-hidden'>
          <AvatarImage source={UserAvatar} />
          <AvatarFallback className="bg-teal-100">
            <Text className="font-bold text-teal-800 text-lg">{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </AvatarFallback>
        </Avatar>
      </View>

      {/* Balance Card */}
      <View className="mt-5 px-5">
        <LinearGradient
          colors={[THEME.light.primary, THEME.light.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="shadow-lg p-6 rounded-2xl w-full"
          style={styles.balanceCard}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-medium text-white/80">Total Balance</Text>
            <Pressable className="flex-row items-center">
              <Text className="mr-1 text-white text-sm">View history</Text>
              <Icon as={ChevronRight} size={16} className="text-white" />
            </Pressable>
          </View>
          
          <View className="mb-6">
            <Text className="font-bold text-white text-3xl">KSh. {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="justify-center items-center bg-white/20 mr-2 rounded-full w-10 h-10">
                <Icon as={TrendingUp} size={18} className="text-white" />
              </View>
              <View>
                <Text className="text-white/70 text-xs">Amount owed</Text>
                <Text className="font-semibold text-white">KSh. {amountOwed.toLocaleString()}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="justify-center items-center bg-white/20 mr-2 rounded-full w-10 h-10">
                <Icon as={TrendingDown} size={18} className="text-red-500" />
              </View>
              <View>
                <Text className="text-white/70 text-xs">Total debt</Text>
                <Text className="font-semibold text-white">KSh. {totalDebted.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View className="mt-6 px-5">
        <SectionHeader title="Quick Actions" />
        <View className="flex-row justify-between">
          <Link href="/" asChild>
            <Pressable className="justify-center items-center bg-white shadow-sm p-4 border border-gray-100 rounded-2xl w-32 h-24">
              <View className="justify-center items-center bg-teal-100 mb-2 rounded-full w-12 h-12">
                <Icon as={DollarSign} size={24} className="text-teal-600" />
              </View>
              <Text className="font-medium text-gray-700">Add Income</Text>
            </Pressable>
          </Link>
          
          <Link href="/debts" asChild>
            <Pressable className="justify-center items-center bg-white shadow-sm p-4 border border-gray-100 rounded-2xl w-32 h-24">
              <View className="justify-center items-center bg-red-100 mb-2 rounded-full w-12 h-12">
                <Icon as={CreditCard} size={24} className="text-red-600" />
              </View>
              <Text className="font-medium text-gray-700">Register Debt</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Spending Categories */}
      {/* <View className="mt-6 px-5">
        <SectionHeader title="Spending Categories" hasLink linkText="see all" href="/spendingcategory" />

        <FlatList
          data={spendingCategories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 16 }}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => (
            <Pressable className="justify-center items-center bg-white shadow-sm border border-gray-100 rounded-2xl w-20 h-20">
              <View className="justify-center items-center mb-2 rounded-full w-10 h-10" style={{ backgroundColor: `${item.color}20` }}>
              </View>
              <Text className="font-medium text-gray-700 text-xs text-center">{item.name}</Text>
            </Pressable>
          )}
          ListHeaderComponent={<SpendingCategoryCreateButton />}
        />
      </View> */}

      {/* Recent Transactions */}
      <View className="mt-6 mb-6 px-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-bold text-gray-800 text-lg">Recent Debts</Text>
          <Link href="/(tabs)/spending" asChild>
            <Pressable className="flex-row items-center">
              <Text className="mr-1 font-medium text-teal-600">See all</Text>
              <Icon as={ChevronRight} size={16} className="text-teal-600" />
            </Pressable>
          </Link>
        </View>
        
        <View className="bg-white">
          {debts.map((debt) => (
            <DebtCard
              key={String(debt.id)}
              debt={debt}
              contactName={contacts.find(c => c.id === debt.contactId)?.name}
            />
          ))}
        </View>
      </View>
    </ScrollView>
    </Container>
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