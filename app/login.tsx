import { useState } from 'react';
import { router } from 'expo-router';
import { useProfile } from '../context/ProfileContext';
import { ActivityIndicator, SafeAreaView, Text, TextInput, Button, View } from 'react-native';

export default function LoginScreen() {
    const { setToken, setProfile } = useProfile();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                setToken(data.access);
                setProfile(data.user?.profile || {});
                router.replace('/(drawer)/(tabs)/dashboard');
            } else {
                setError(data.detail || 'Invalid credentials');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Login</Text>

            {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
            />

            {loading ? <ActivityIndicator size="large" /> : <Button title="Login" onPress={handleLogin} />}

            <View style={{ marginTop: 20 }}>
                <Button title="Sign Up" onPress={() => router.push('/register')} color="gray" />
            </View>
        </SafeAreaView>
    );
}