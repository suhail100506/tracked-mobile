import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="activities" options={{ title: 'Activities' }} />
                <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
                <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
                <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            </Tabs>
            <StatusBar style="auto" />
        </>
    );
}