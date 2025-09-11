import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from './ui/icon';

type Props = {
    title: string;
    hasLink?: boolean;
    linkText?: string;
    href?: string;
    onLinkPress?: () => void;
}


export default function SectionHeader({ title, hasLink=false, linkText="See all", onLinkPress, href }: Props) {
  return (
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          {hasLink && (
            <Link href={href as any} asChild>
              <Pressable className="flex-row items-center">
                <Text className="text-teal-600 font-medium mr-1">{linkText}</Text>
                <Icon as={ChevronRight} size={16} className="text-teal-600" />
              </Pressable>
            </Link>
          )}
        </View>
  )
}