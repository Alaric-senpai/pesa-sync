import Container from '@/components/Container';
import GlobalContext, { useGlobalContext } from '@/context/GlobalContext';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { use, useEffect, useState } from 'react';

import * as splashScreen from 'expo-splash-screen';
splashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  // useEffect(()=>{
  //   setColorScheme('light');
  // },[])

  return (
    <GlobalContext>
      <ThemeProvider value={NAV_THEME['light']}>
        <StatusBar style={'light'} />
        <Routes />
        <PortalHost />
      </ThemeProvider>

    </GlobalContext>
  );
}



const Routes = () => {

  const { username, phoneNumber } = useGlobalContext();

  useEffect(() => {

    if (username && phoneNumber) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }

  splashScreen.hideAsync();

  }, [username, phoneNumber]);
  const [signedIn, setSignedIn] = useState(false);

  return (
        <Stack>
          <Stack.Protected guard={!signedIn} >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="setup" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={signedIn} >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            <Stack.Screen name="spendingcategory" options={{ title: 'Add a new spending category' ,headerShown: false, presentation: 'fullScreenModal'}} />
            <Stack.Screen name="notifications" options={{ title: 'Notifications' ,headerShown: false, presentation: 'fullScreenModal'}} />
            <Stack.Screen name="terms" options={{ title: 'Terms of Service' ,headerShown: false}} />
            <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' ,headerShown: false}} />
            <Stack.Screen name="contactus" options={{ title: 'Contact Us' ,headerShown: false}} />
            <Stack.Screen name="help-center" options={{ title: 'Help Center' ,headerShown: false}} />

          </Stack.Protected>
        </Stack>
  )
}