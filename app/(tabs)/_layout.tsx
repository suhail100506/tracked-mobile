import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="marks" options={{ title: 'Marks' }} />
      <Tabs.Screen name="activities" options={{ title: 'Activities' }} />
    </Tabs>
  );
}
