import { Logo, MessageReceived, Receptionist, Wallet } from '@/constants/images';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';
import Container from '@/components/Container';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

type OnboardingPageProps = {
  title: string;
  subtitle: string;
  image: any;
  index?: number;
};

const OnboardingPage = ({ title, subtitle, image, index }: OnboardingPageProps) => {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="mb-8">
      <Image
        source={image}
        alt='Onboarding Image'

        contentFit="contain"
        transition={300}
        style={{
          width: width * 0.7,
          height: width * 0.7,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        }}
      />

      </View>
      <Text className="text-3xl font-bold text-center text-teal-800 mb-3">{title}</Text>
      <Text className="text-lg text-center text-gray-600 leading-relaxed px-4">{subtitle}</Text>
    </View>
  );
};

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  
  const pages = [
    {
      image: Logo,
      title: 'Pesa Sync',
      subtitle: 'Track smarter. Live richer.',
    },
    {
      image: Wallet,
      title: 'Smart Expense Tracking',
      subtitle: 'Automatically categorize and visualize your spending.',
    },
    {
      image: MessageReceived,
      title: 'Seamless Message Integration',
      subtitle: 'Sync your wallet with your finance messages.',
    },
    {
      image: Receptionist,
      title: 'Get Started Now!',
      subtitle: 'Your journey to financial wellness begins here.',
    },
  ];

  const handleNextPress = () => {
    if (currentPage < pages.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handleSkipPress = () => {
    pagerRef.current?.setPage(pages.length - 1);
  };

  return (
      <Container>
        <PagerView
          style={{ flex: 1, width }}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(event) => {
            setCurrentPage(event.nativeEvent.position);
          }}
          orientation="horizontal"
        >
          {pages.map((page, index) => (
            <OnboardingPage
              key={index}
              index={index}
              title={page.title}
              subtitle={page.subtitle}
              image={page.image}
            />
          ))}
        </PagerView>

        <View className="px-6 pb-8">
          {/* Progress Dots */}
          <View className="flex-row justify-center mb-6">
            {pages.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-teal-500 w-10' 
                    : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center">
            {currentPage < pages.length - 1 && (
              <TouchableOpacity 
                onPress={handleSkipPress}
                className="py-3 px-5 rounded-full bg-white/50 backdrop-blur-sm shadow-sm"
              >
                <Text className="text-gray-600 font-medium">Skip</Text>
              </TouchableOpacity>
            )}
            
            {currentPage !== pages.length - 1 ? (
              <TouchableOpacity 
                onPress={handleNextPress}
                className="flex-row items-center justify-center py-3 px-6 rounded-full bg-teal-500  active:scale-95 transition-transform"
              >
                <Text className="text-white font-semibold mr-1">Next</Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </TouchableOpacity>
            ) : (
              <Link asChild href={'/setup'}>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center py-4 rounded-full bg-custom-secondarteal ">
                  <Text className="text-white font-bold text-lg">Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" className="ml-2" />
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
      </Container>
  );
};

export default Onboarding;