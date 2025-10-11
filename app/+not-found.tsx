import { Link, Stack } from 'expo-router';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerShown: false 
      }} />
      
      <View style={styles.container}>
        <View style={styles.content}>
          {/* 404 Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle-outline" size={80} color="#0d9488" />
          </View>
          
          {/* Title and Message */}
          <Text style={styles.title}>Oops! Page Not Found</Text>
          <Text style={styles.message}>
            The page you are looking for might have been removed, 
            had its name changed, or is temporarily unavailable.
          </Text>
          
          {/* Home Button */}
          <Link href="/" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Go to Home Screen</Text>
            </TouchableOpacity>
          </Link>
          
          {/* Additional Help */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Need help? Contact support</Text>
            <Link href="/help-center" asChild>
              <TouchableOpacity>
                <Text style={styles.helpLink}>Get Support</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    backgroundColor: '#ccfbf1',
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0d9488',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  helpLink: {
    fontSize: 14,
    color: '#0d9488',
    fontWeight: '600',
  },
});