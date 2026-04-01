import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
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
            </Drawer>
        </GestureHandlerRootView>
    );
}