
import { useState } from 'react';
import { router } from 'expo-router';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Screen() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(true);

    const handleLogin = async () => {
        // 1. Input Validation (Security Requirement)
        setErrorMessage('');
        if (!identifier.trim() || !password.trim()) {
            setErrorMessage('Username/Email and password are required.');
            return;
        }

        setLoading(true);

        try {
            // 2. HTTP POST Request (Send data to backend)
            // Note: Using your computer's local Wi-Fi IP so a physical phone can reach it
            const response = await fetch('http://172.16.26.76:8000/api/users/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Login Success: Store JWT (Token Management) and Redirect
                // e.g. await SecureStore.setItemAsync('token', data.access);
                router.replace('/(drawer)/(tabs)/dashboard');
            } else {
                // ❌ Show error message from backend
                setErrorMessage(data.detail || 'Invalid username or password.');
            }
        } catch (error) {
            // Fallback for development if backend is not running yet
            setErrorMessage('Network error. Check backend server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.formCard}>
                    <Text style={styles.title}>Sign into portal</Text>
                    <Text style={styles.subtitle}>Enter your credentials to continue</Text>

                    {errorMessage ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <View style={styles.field}>
                        <Text style={styles.label}>Username / Email</Text>
                        <TextInput
                            placeholder="e.g. student@univ.edu"
                            placeholderTextColor="#707974"
                            autoCapitalize="none"
                            value={identifier}
                            onChangeText={setIdentifier}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>Password</Text>
                            <Text style={styles.link}>Forgot Password?</Text>
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="********"
                                placeholderTextColor="#707974"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                style={styles.passwordInput}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={styles.showHideText}>{showPassword ? 'Hide' : 'Show'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.checkRow}
                        onPress={() => setRemember((value) => !value)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
                        <Text style={styles.checkText}>Keep me signed in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.signupRow}>
                        <Text style={styles.helpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={{ marginTop: 16, alignItems: 'center' }} 
                        onPress={() => router.replace('/advisor-dashboard')}
                    >
                        <Text style={[styles.link, { color: '#707974', textDecorationLine: 'underline' }]}>
                            Login as Academic Advisor
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f8faf9',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    brandCard: {
        backgroundColor: '#1B4D3E',
        borderRadius: 20,
        padding: 20,
    },
    brandIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        marginBottom: 12,
    },
    brandTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '800',
    },
    brandSub: {
        color: '#baeed9',
        marginTop: 6,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#003629',
    },
    subtitle: {
        marginTop: 6,
        color: '#707974',
    },
    field: {
        marginTop: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#707974',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    input: {
        marginTop: 8,
        backgroundColor: '#f2f4f3',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#003629',
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1B4D3E',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f4f3',
        borderRadius: 12,
        marginTop: 8,
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        color: '#003629',
    },
    showHideText: {
        color: '#1B4D3E',
        fontWeight: '600',
        paddingHorizontal: 8,
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
    },
    signupRow: {
        marginTop: 36,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkRow: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#c0c9c3',
        backgroundColor: '#ffffff',
    },
    checkboxChecked: {
        backgroundColor: '#1B4D3E',
        borderColor: '#1B4D3E',
    },
    checkText: {
        color: '#707974',
        fontWeight: '600',
    },
    primaryButton: {
        marginTop: 18,
        backgroundColor: '#1B4D3E',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: '800',
    },
    helpText: {
        color: '#707974',
        textAlign: 'center',
    },
});
