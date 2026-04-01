import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1B4D3E' }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    title: 'Attendance',
                    tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="marks"
                options={{
                    title: 'Marks',
                    tabBarIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color }) => <Ionicons name="basketball-outline" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}
