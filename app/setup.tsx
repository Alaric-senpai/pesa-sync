import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native'
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

const setupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    age: z.number().min(13, 'Age must be at least 13').max(120, 'Please enter a valid age'),
})

export type SetupFormDatatype = z.infer<typeof setupSchema>;

export default function SetupAccount() {
    const { createAccount, isLoading } = useGlobalContext();
    const [isCreating, setIsCreating] = useState(false);
    
    const { control, handleSubmit, formState: { errors }, reset } = useForm<SetupFormDatatype>({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            username: '',
            name: '',
            email: '',
            phone: '',
            age: 18,
        },
        mode: 'onBlur',
    })
    
    const onSubmit = async (data: SetupFormDatatype) => {
        setIsCreating(true);
        try {
            const result = await createAccount(data);
            
            if (result.success) {
                // Navigate to app and show a success toast
                router.replace('/(tabs)')
                Toast.show({
                    type: 'success',
                    text1: 'Account Created!',
                    text2: `Welcome ${result.user?.name}! Your account has been created successfully.`,
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Account Creation Failed',
                    text2: result.error || 'Something went wrong. Please try again.',
                })
            }
        } catch (error) {
            console.error('Account creation error:', error);
            Toast.error('Failed to create account. Please try again.')
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <Container >
            <ScrollView 
                className="flex-1" 
                contentContainerClassName="pb-8"
                showsVerticalScrollIndicator={false}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 px-6 pt-14">
                            {/* Header Section */}
                            <View className="items-center mb-10">
                                <TouchableOpacity 
                                    onPress={() => router.back()} 
                                    className="top-0 left-0 z-10 absolute justify-center items-center bg-teal-600 shadow-md rounded-full w-12 h-12"
                                >
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                                
                                <View className="justify-center items-center bg-teal-500 shadow-lg mb-4 rounded-full w-20 h-20">
                                    <Ionicons name="person-add-outline" size={40} color="white" />
                                </View>
                                
                                <Text className="mb-2 font-bold text-teal-800 text-3xl">Create Your Account</Text>
                                <Text className="px-4 text-gray-600 text-center">Join PesaSync and start managing your finances</Text>
                            </View>

                            {/* Form Card */}
                            <Card className="bg-white shadow-md border-0 rounded-2xl overflow-hidden">
                                <CardContent className="space-y-5 p-6">
                                    {/* Username Field */}
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
                                                    placeholder="Choose a unique username"
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

                                    {/* Name Field */}
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View>
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="id-card-outline" size={20} color="#0d9488" />
                                                    <Text className="ml-2 font-medium text-teal-700">Full Name</Text>
                                                </View>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    value={value}
                                                    className={cn(
                                                        'bg-gray-50 border rounded-xl h-12 text-gray-800',
                                                        errors.name ? 'border-red-400' : 'border-gray-200'
                                                    )}
                                                    placeholderTextColor="#9ca3af"
                                                />
                                                {errors.name && (
                                                    <View className="flex-row items-center mt-1">
                                                        <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                        <Text className="ml-1 text-red-500 text-sm">{errors.name.message}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    />

                                    {/* Email Field */}
                                    <Controller
                                        name='email'
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View>
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="mail-outline" size={20} color="#0d9488" />
                                                    <Text className="ml-2 font-medium text-teal-700">Email Address</Text>
                                                </View>
                                                <Input
                                                    placeholder="Enter your email address"
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    value={value}
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    className={cn(
                                                        'bg-gray-50 border rounded-xl h-12 text-gray-800',
                                                        errors.email ? 'border-red-400' : 'border-gray-200'
                                                    )}
                                                    placeholderTextColor="#9ca3af"
                                                />
                                                {errors.email && (
                                                    <View className="flex-row items-center mt-1">
                                                        <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                        <Text className="ml-1 text-red-500 text-sm">{errors.email.message}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    />
                                    
                                    {/* Phone Field */}
                                    <Controller
                                        name='phone'
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View>
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="call-outline" size={20} color="#0d9488" />
                                                    <Text className="ml-2 font-medium text-teal-700">Phone Number</Text>
                                                </View>
                                                <Input
                                                    placeholder="Enter your phone number"
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    value={value}
                                                    keyboardType="phone-pad"
                                                    className={cn(
                                                        'bg-gray-50 border rounded-xl h-12 text-gray-800',
                                                        errors.phone ? 'border-red-400' : 'border-gray-200'
                                                    )}
                                                    placeholderTextColor="#9ca3af"
                                                />
                                                {errors.phone && (
                                                    <View className="flex-row items-center mt-1">
                                                        <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                        <Text className="ml-1 text-red-500 text-sm">{errors.phone.message}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    />

                                    {/* Age Field */}
                                    <Controller
                                        name='age'
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View>
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="calendar-outline" size={20} color="#0d9488" />
                                                    <Text className="ml-2 font-medium text-teal-700">Age</Text>
                                                </View>
                                                <Input
                                                    placeholder="Enter your age"
                                                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                                                    onBlur={onBlur}
                                                    value={value?.toString() || ''}
                                                    keyboardType="numeric"
                                                    className={cn(
                                                        'bg-gray-50 border rounded-xl h-12 text-gray-800',
                                                        errors.age ? 'border-red-400' : 'border-gray-200'
                                                    )}
                                                    placeholderTextColor="#9ca3af"
                                                />
                                                {errors.age && (
                                                    <View className="flex-row items-center mt-1">
                                                        <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                                                        <Text className="ml-1 text-red-500 text-sm">{errors.age.message}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    />
                                    
                                    {/* Submit Button */}
                                    <Button 
                                        onPress={handleSubmit(onSubmit)} 
                                        disabled={isCreating || isLoading}
                                        className={cn(
                                            "mt-4 py-4 rounded-2xl h-14",
                                            isCreating || isLoading 
                                                ? "bg-gray-400" 
                                                : "bg-teal-600"
                                        )}
                                    >
                                        <View className="flex-row justify-center items-center">
                                            {(isCreating || isLoading) && (
                                                <Ionicons 
                                                    name="hourglass-outline" 
                                                    size={20} 
                                                    color="white" 
                                                    className="mr-2" 
                                                />
                                            )}
                                            <Text className="font-semibold text-white text-lg">
                                                {isCreating ? 'Creating Account...' : 'Create Account'}
                                            </Text>
                                        </View>
                                    </Button>

                                    {/* Login Link */}
                                    <View className="items-center mt-6">
                                        <Text className="mb-1 text-gray-600">Already have an account?</Text>
                                        <TouchableOpacity onPress={() => router.push('/login')} className="active:opacity-70">
                                            <Text className="font-semibold text-teal-700">Login Here</Text>
                                        </TouchableOpacity>
                                    </View>
                                </CardContent>
                            </Card>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
        </Container>
    )
}