import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [loading, setLoading] = useState(false);

    // Form State mapped to Global State
    const { profile, setProfile, token } = useProfile();

    const handleChange = (field: string, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users/profile/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                Alert.alert("Success", "Academic Profile Updated Successfully!");
            } else {
                Alert.alert("Error", "Failed to update profile on backend");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Academic Profile</Text>
                    <Text style={styles.subtitle}>Manage your academic configurations.</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle-outline" size={24} color="#00543f" />
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                    </View>

                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="John Doe" value={profile.fullName} onChangeText={(val) => handleChange('fullName', val)} />
                    </View>

                    <Text style={styles.label}>Roll Number</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="id-card-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="CS2026001" value={profile.rollNo} onChangeText={(val) => handleChange('rollNo', val)} />
                    </View>

                    <Text style={styles.label}>Department</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="business-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Computer Science" value={profile.department} onChangeText={(val) => handleChange('department', val)} />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sectionHeader}>
                        <Ionicons name="school-outline" size={24} color="#00543f" />
                        <Text style={styles.sectionTitle}>Academic Metrics</Text>
                    </View>

                    <Text style={styles.label}>Current CGPA</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="stats-chart-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="e.g. 8.5" keyboardType="decimal-pad" value={profile.cgpa} onChangeText={(val) => handleChange('cgpa', val)} />
                    </View>

                    <Text style={styles.label}>Attendance (%)</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="e.g. 85%" keyboardType="decimal-pad" value={profile.attendance} onChangeText={(val) => handleChange('attendance', val)} />
                    </View>

                    <Text style={styles.label}>Assessment Marks</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="document-text-outline" size={18} color="#707974" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="e.g. 85/100" value={profile.marks} onChangeText={(val) => handleChange('marks', val)} />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sectionHeader}>
                        <Ionicons name="football-outline" size={24} color="#00543f" />
                        <Text style={styles.sectionTitle}>Extracurriculars</Text>
                    </View>

                    <Text style={styles.label}>Clubs & Activities</Text>
                    <TextInput style={[styles.inputContainer, styles.textArea]} placeholder="List your activities, events, or workshops..." multiline numberOfLines={4} value={profile.activities} onChangeText={(val) => handleChange('activities', val)} />

                    <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
                        <Ionicons name="save-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                        <Text style={styles.saveButtonText}>{loading ? "Saving Records..." : "Save Academic Profile"}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f8faf9' },
    container: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', color: '#003629' },
    subtitle: { fontSize: 15, color: '#707974', marginTop: 4 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#003629' },
    label: { fontSize: 12, fontWeight: '700', color: '#707974', textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f6f8f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        marginBottom: 16,
    },
    inputIcon: { paddingLeft: 14 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 16, color: '#003629' },
    textArea: {
        paddingLeft: 14,
        paddingTop: 14,
        paddingBottom: 14,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#003629'
    },
    divider: { height: 1, backgroundColor: '#e2e8e5', marginVertical: 18 },
    saveButton: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonDisabled: { backgroundColor: '#c0c9c3', shadowOpacity: 0 },
    saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' }
});
