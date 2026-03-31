
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Screen() {
    const [remember, setRemember] = useState(true);

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.brandCard}>
                    <View style={styles.brandIcon} />
                    <Text style={styles.brandTitle}>Atheneum OS</Text>
                    <Text style={styles.brandSub}>Next-generation academic management.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.title}>Sign into portal</Text>
                    <Text style={styles.subtitle}>Enter your institutional credentials to continue</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>University ID</Text>
                        <TextInput
                            placeholder="e.g. 2024-88A"
                            placeholderTextColor="#707974"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>Passphrase</Text>
                            <Text style={styles.link}>Forgot?</Text>
                        </View>
                        <TextInput
                            placeholder="********"
                            placeholderTextColor="#707974"
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.checkRow}
                        onPress={() => setRemember((value) => !value)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
                        <Text style={styles.checkText}>Keep me signed in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
                        <Text style={styles.primaryButtonText}>Authenticate</Text>
                    </TouchableOpacity>

                    <Text style={styles.helpText}>Require technical assistance? Contact IT Support</Text>
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
        marginTop: 16,
        color: '#707974',
        textAlign: 'center',
    },
});
