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

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // 1. Input Validation
        setErrorMessage('');
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // Actual backend registration request hitting MongoDB endpoint
            const response = await fetch('http://10.73.63.213:8000/api/users/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Prompt user and navigate to login
                alert(data.message || 'Registration Successful!');
                router.replace('/');
            } else {
                setErrorMessage(data.error || 'Registration failed.');
                if (data.details) {
                    console.log("DB Error:", data.details);
                }
            }

        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.brandCard}>
                    <View style={styles.brandIcon} />
                    <Text style={styles.brandTitle}>Atheneum OS</Text>
                    <Text style={styles.brandSub}>Create your academic portal account.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Enter your details to register</Text>

                    {errorMessage ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <View style={styles.field}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            placeholder="e.g. jdoe88"
                            placeholderTextColor="#707974"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            placeholder="e.g. student@univ.edu"
                            placeholderTextColor="#707974"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
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

                    <View style={styles.field}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="********"
                                placeholderTextColor="#707974"
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={styles.passwordInput}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.signupRow}>
                        <Text style={styles.helpText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/')}>
                            <Text style={styles.link}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
        gap: 20,
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
    primaryButton: {
        backgroundColor: '#1B4D3E',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
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
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        color: '#707974',
        fontSize: 14,
    },
    link: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B4D3E',
    },
});
