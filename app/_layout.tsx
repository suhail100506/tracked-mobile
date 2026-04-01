import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProfileProvider } from '../context/ProfileContext';

export default function RootLayout() {
    return (
        <ProfileProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='index' />
                <Stack.Screen name='register' />
                <Stack.Screen name='(drawer)' />
            </Stack>
            <StatusBar style='auto' />
        </ProfileProvider>
    );
}
