import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
import { Toast } from 'toastify-react-native'
import ScrollableContainer from '@/components/ScrollableContainer'

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, isLoading } = useGlobalContext();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
        },
        mode: 'onBlur',
    })
    
    const onSubmit = async (data: LoginFormData) => {
        setIsLoggingIn(true);
        try {
            const result = await login(data.username);
            
            if (result.success) {
                router.replace('/(tabs)')
                Toast.show({
                    type: 'success',
                    text1: 'Welcome Back!',
                    text2: `Hello ${result.user?.name}! You have been logged in successfully.`,
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: result.error || 'Username not found. Please check your username or create a new account.',
                })
            }
        } catch (error) {
            console.error('Login error:', error);
            Toast.error('Failed to login. Please try again.')
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <ScrollableContainer >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    className="top-5 left-4 z-10 absolute justify-center items-center bg-teal-600 shadow-md rounded-full w-12 h-12"
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-center items-center px-6 pt-16 w-full m-auto">
                        <View className="items-center mb-10">
                            <View className="justify-center items-center bg-teal-500 shadow-lg mb-4 rounded-full w-20 h-20">
                                <Ionicons name="log-in-outline" size={40} color="white" />
                            </View>
                            <Text className="mb-2 font-bold text-teal-800 text-3xl">Welcome Back</Text>
                            <Text className="px-4 text-gray-600 text-center">Login to continue using PesaSync</Text>
                        </View>

                        <Card className="bg-white shadow-md border-0 rounded-2xl w-full max-w-md overflow-hidden">
                            <CardContent className="space-y-5 p-6">
                                <Controller
                                    name='username'
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <View className="flex-row items-center mb-2">
                                                <Ionicons name="person-outline" size={20} color="#0d9488" />
                                                <Text className="ml-2 font-medium text-teal-700">Username</Text>
                                            </View>
                                            <Input
                                                placeholder="Enter your username"
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                autoCapitalize="none"
                                                className={cn(
                                                    'bg-gray-50 border rounded-xl h-12 text-gray-800',
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
                                
                                <Button 
                                    onPress={handleSubmit(onSubmit)} 
                                    disabled={isLoggingIn || isLoading}
                                    className={cn(
                                        "mt-4 py-4 rounded-2xl h-14",
                                        isLoggingIn || isLoading 
                                            ? "bg-gray-400" 
                                            : "bg-teal-600"
                                    )}
                                >
                                    <View className="flex-row justify-center items-center">
                                        {(isLoggingIn || isLoading) && (
                                            <Ionicons 
                                                name="hourglass-outline" 
                                                size={20} 
                                                color="white" 
                                                className="mr-2" 
                                            />
                                        )}
                                        <Text className="font-semibold text-white text-lg">
                                            {isLoggingIn ? 'Logging In...' : 'Login'}
                                        </Text>
                                    </View>
                                </Button>

                                <View className="items-center mt-6">
                                    <Text className="mb-1 text-gray-600">Don't have an account?</Text>
                                    <TouchableOpacity 
                                        onPress={() => router.push('/setup')} 
                                        className="active:opacity-70"
                                    >
                                        <Text className="font-semibold text-teal-700">Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </CardContent>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollableContainer>
    )
}