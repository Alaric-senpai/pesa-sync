import Container from '@/components/Container';
import GlobalContext, { useGlobalContext } from '@/context/GlobalContext';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
// @ts-ignore
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { use, useEffect, useState } from 'react';
import { initializeDatabase } from '@/lib/database';
import ToastManager, { Toast } from 'toastify-react-native'

import * as splashScreen from 'expo-splash-screen';
splashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    // Initialize database when app starts
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        setDatabaseReady(true);
        console.log('✅ Database setup complete');
      } catch (error) {
        console.error('❌ Database setup failed:', error);
        // You might want to show an error screen here
      }
    };

    setupDatabase();
  }, []);

  // Don't render the app until database is ready
  if (!databaseReady) {
    return null; // You could show a loading screen here
  }

  return (
    <GlobalContext>
      <ThemeProvider value={NAV_THEME['light']}>
        <StatusBar style={'light'} />
        <ToastManager />
        <Routes />
        <PortalHost />
      </ThemeProvider>
    </GlobalContext>
  );
}



const Routes = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();

  useEffect(() => {
    // Hide splash screen once loading is complete
    if (!isLoading) {
      splashScreen.hideAsync();
    }
  }, [isLoading]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return null; // You could show a loading screen here
  }

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="setup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="debts" options={{ title: 'Add a new transaction', headerShown: false, presentation: 'fullScreenModal'}} />
        <Stack.Screen name="debt/[id]" options={{ title: 'Debt Details', headerShown: false, presentation: 'fullScreenModal'}} />
        <Stack.Screen name="contact/[id]" options={{ title: 'Contact Details', headerShown: false, presentation: 'fullScreenModal'}} />
        <Stack.Screen name="spendingcategory" options={{ title: 'Add a new spending category', headerShown: false, presentation: 'fullScreenModal'}} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications', headerShown: false, presentation: 'fullScreenModal'}} />
        <Stack.Screen name="terms" options={{ title: 'Terms of Service', headerShown: false}} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', headerShown: false}} />
        <Stack.Screen name="contactus" options={{ title: 'Contact Us', headerShown: false}} />
        <Stack.Screen name="help-center" options={{ title: 'Help Center', headerShown: false}} />
      </Stack.Protected>
    </Stack>
  )
}