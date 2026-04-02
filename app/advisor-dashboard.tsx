import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Sample mock data for advisor
const students = [
  { id: '24CS139', name: 'Mohammed Suhail M', cgpa: '8.7', attendance: '86%' },
  { id: '21CS046', name: 'John Doe', cgpa: '7.5', attendance: '72%' },
  { id: '21CS047', name: 'Jane Smith', cgpa: '9.2', attendance: '95%' },
];

export default function AdvisorDashboard() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Advisor Portal</Text>
          <Text style={styles.subtitle}>Manage your advisees</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{students.length}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>1</Text>
              <Text style={styles.statLabel}>Needs Attention</Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Student Roster</Text>
        {students.map((student) => (
          <TouchableOpacity key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentId}>{student.id}</Text>
            </View>
            <View style={styles.metrics}>
              <View style={styles.metric}>
                <Ionicons name="school" size={16} color="#10b981" />
                <Text style={styles.metricText}>CGPA: {student.cgpa}</Text>
              </View>
              <View style={styles.metric}>
                <Ionicons name="calendar" size={16} color="#3b82f6" />
                <Text style={styles.metricText}>Att: {student.attendance}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c0c9c3" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8faf9' },
  header: { backgroundColor: '#1B4D3E', padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#baeed9', fontSize: 14, marginTop: 4 },
  container: { padding: 20, gap: 16 },
  statsCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8e5', elevation: 2 },
  statsTitle: { fontSize: 16, fontWeight: '700', color: '#003629', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#f2f4f3', padding: 16, borderRadius: 12, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '800', color: '#1B4D3E' },
  statLabel: { fontSize: 12, color: '#707974', marginTop: 4, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#003629', marginTop: 8 },
  studentCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8e5', flexDirection: 'row', alignItems: 'center', elevation: 1 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#003629' },
  studentId: { fontSize: 13, color: '#707974', marginTop: 2 },
  metrics: { flexDirection: 'column', gap: 4, marginRight: 16 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
});
