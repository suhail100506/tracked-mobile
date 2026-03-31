import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer>
                <Drawer.Screen 
                    name="(tabs)" 
                    options={{ 
                        title: 'Home',
                        drawerLabel: 'Home'
                    }} 
                />
                <Drawer.Screen 
                    name="analytics" 
                    options={{ 
                        title: 'Analytics',
                        drawerLabel: 'Analytics'
                    }} 
                />
                <Drawer.Screen 
                    name="reports" 
                    options={{ 
                        title: 'Reports',
                        drawerLabel: 'Reports'
                    }} 
                />
                <Drawer.Screen 
                    name="profile" 
                    options={{ 
                        title: 'Profile',
                        drawerLabel: 'Profile'
                    }} 
                />
                <Drawer.Screen 
                    name="index" 
                    options={{ 
                        drawerItemStyle: { display: 'none' }
                    }} 
                />
            </Drawer>
            <StatusBar style="auto" />
        </GestureHandlerRootView>
    );
}