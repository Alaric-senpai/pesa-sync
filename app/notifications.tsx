import { View, Text, Switch, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsPage() {
  const router = useRouter();
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);

  return (
      <View className="flex-1 bg-gray-50">
        <View className="pt-12 pb-4 px-5 bg-white shadow-sm">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="chevron-back" size={24} color="#0d9488" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Notifications</Text>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="">
            <Text className="text-gray-500 text-sm font-medium px-5 pt-5 pb-2">FINANCIAL ALERTS</Text>
            
            <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                  <Ionicons name="wallet-outline" size={22} color="#0d9488" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">Transaction Alerts</Text>
                  <Text className="text-gray-500 text-sm">Notify when new transactions are detected</Text>
                </View>
              </View>
              <Switch 
                value={transactionAlerts} 
                onValueChange={setTransactionAlerts}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={'#ffffff'}
              />
            </View>
            
            <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                  <Ionicons name="alert-circle-outline" size={22} color="#0d9488" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">Budget Warnings</Text>
                  <Text className="text-gray-500 text-sm">Alert when approaching budget limits</Text>
                </View>
              </View>
              <Switch 
                value={budgetWarnings} 
                onValueChange={setBudgetWarnings}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={'#ffffff'}
              />
            </View>
            
            <View className="flex-row items-center justify-between p-5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                  <Ionicons name="bar-chart-outline" size={22} color="#0d9488" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">Weekly Reports</Text>
                  <Text className="text-gray-500 text-sm">Summary of weekly spending</Text>
                </View>
              </View>
              <Switch 
                value={weeklyReports} 
                onValueChange={setWeeklyReports}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={'#ffffff'}
              />
            </View>
          </View>
          
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
            <Text className="text-gray-500 text-sm font-medium px-5 pt-5 pb-2">SYSTEM NOTIFICATIONS</Text>
            
            <View className="flex-row items-center justify-between p-5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                  <Ionicons name="notifications-outline" size={22} color="#0d9488" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">System Notifications</Text>
                  <Text className="text-gray-500 text-sm">App updates and important information</Text>
                </View>
              </View>
              <Switch 
                value={systemNotifications} 
                onValueChange={setSystemNotifications}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={'#ffffff'}
              />
            </View>
          </View>
          
          <View className="bg-teal-50 w-11/12 m-auto rounded-2xl p-5 shadow-sm mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="lock-closed-outline" size={24} color="#0d9488" className="mr-2" />
              <Text className="text-teal-800 font-bold">Privacy Note</Text>
            </View>
            <Text className="text-teal-700">
              All notifications are generated locally on your device. No data is transmitted to external servers.
            </Text>
          </View>
        </View>
      </View>
  );
}