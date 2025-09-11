import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '@/components/Container'
import { Card, CardContent } from '@/components/ui/card'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Ionicons } from '@expo/vector-icons'
import { cn } from '@/lib/utils'
import { router } from 'expo-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGlobalContext } from '@/context/GlobalContext'

const setupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
})

export type SetupFormDatatype = z.infer<typeof setupSchema>;

export default function SetupAccount() {
    const {setAccount} = useGlobalContext();
    const { control, handleSubmit, formState: { errors } } = useForm<SetupFormDatatype>({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            username: '',
            phoneNumber: '',
        },
        mode: 'onBlur',
    })
    
    const onSubmit = (data: SetupFormDatatype) => {
        console.log(data);
        setAccount(data);
    }

    return (
        <Container >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 relative"
            >
                <TouchableOpacity onPress={()=> router.back()} className='absolute top-5 h-14 items-center justify-center w-14 rounded-full left-4 bg-black z-10'>
                    <Ionicons name="arrow-back" size={24} color="#fff"  />
                </TouchableOpacity>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-center items-center px-6">
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-teal-500 rounded-full items-center justify-center mb-4">
                                <Ionicons name="person-add-outline" size={40} color="white" />
                            </View>
                            <Text className="text-3xl font-bold text-teal-800">Setup Your Account</Text>
                            <Text className="text-gray-600 mt-2 text-center">Create your profile to get started</Text>
                        </View>

                        <Card className="w-full max-w-md bg-white rounded-2xl  border-0 overflow-hidden">
                            <CardContent className="p-6 space-y-5">
                                <Controller
                                    name='username'
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <View className="flex-row items-center mb-2">
                                                <Ionicons name="person-outline" size={20} color="#0d9488" />
                                                <Text className="ml-2 text-teal-700 font-medium">Username</Text>
                                            </View>
                                            <Input
                                                placeholder="Choose a username"
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                className={cn(
                                                    'bg-gray-50 border h-max min-h-12  rounded-xl p-2 text-gray-800',
                                                    errors.username ? 'border-red-400' : 'border-gray-200'
                                                )}
                                                placeholderTextColor="#9ca3af"
                                            />
                                            {errors.username && (
                                                <View className="flex-row items-center mt-1">
                                                    <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                    <Text className="ml-1 text-red-500 text-sm">{errors.username.message}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                />
                                
                                <Controller
                                    name='phoneNumber'
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <View className="flex-row items-center mb-2">
                                                <Ionicons name="call-outline" size={20} color="#0d9488" />
                                                <Text className="ml-2 text-teal-700 font-medium">Phone Number</Text>
                                            </View>
                                            <Input
                                                placeholder="Enter your phone number"
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                keyboardType="phone-pad"
                                                className={cn(
                                                    'bg-gray-50 border  rounded-xl p-2 min-h-12 h-max text-gray-800',
                                                    errors.phoneNumber ? 'border-red-400' : 'border-gray-200'
                                                )}
                                                placeholderTextColor="#9ca3af"
                                            />
                                            {errors.phoneNumber && (
                                                <View className="flex-row items-center mt-1">
                                                    <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                    <Text className="ml-1 text-red-500 text-sm">{errors.phoneNumber.message}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                />
                                
                                <Button 
                                    onPress={handleSubmit(onSubmit)} 
                                    className="mt-6 py-4 rounded-2xl bg-custom-secondarteal  min-h-12 h-max  "
                                >
                                    <Text className="text-white font-semibold text-lg">Complete Setup</Text>
                                </Button>
                            </CardContent>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Container>
    )
}