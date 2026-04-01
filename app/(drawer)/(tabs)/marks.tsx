import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '../../../context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

export default function Screen() {
    const { profile } = useProfile();
    const isExcellent = parseFloat(profile.cgpa) >= 8.5;

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.title}>Academic Record</Text>
                        <Text style={styles.subtitle}>Performance for {profile.fullName || 'Student'}</Text>
                    </View>
                    <Ionicons name="school" size={40} color="#1B4D3E" opacity={0.2} />
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="bar-chart" size={20} color="#00543f" style={styles.statIcon} />
                        <Text style={styles.statLabel}>Term CGPA</Text>
                        <Text style={[styles.statValue, isExcellent && { color: '#10b981' }]}>{profile.cgpa || '--'}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="analytics" size={20} color="#00543f" style={styles.statIcon} />
                        <Text style={styles.statLabel}>Cum. GPA</Text>
                        <Text style={styles.statValue}>{profile.cgpa || '--'}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="ribbon" size={20} color="#00543f" style={styles.statIcon} />
                        <Text style={styles.statLabel}>Credits Earned</Text>
                        <Text style={styles.statValue}>12.5</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="document-text" size={20} color="#00543f" style={styles.statIcon} />
                        <Text style={styles.statLabel}>Total Marks</Text>
                        <Text style={styles.statValue}>{profile.marks || '--'}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Recent Assessments</Text>
                        <Ionicons name="book" size={20} color="#1B4D3E" />
                    </View>

                    {!profile.marks ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="folder-open-outline" size={40} color="#c0c9c3" />
                            <Text style={styles.emptyText}>No grade entries yet. Please update Profile.</Text>
                        </View>
                    ) : (
                        <View style={styles.courseRow}>
                            <View style={styles.courseHeader}>
                                <View style={styles.courseTitleRow}>
                                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                                    <Text style={styles.courseTitle}>Core Assessment</Text>
                                </View>
                                <Text style={styles.courseGrade}>A+</Text>
                            </View>
                            <Text style={styles.courseMeta}>
                                CORE-101 � 3 credits
                            </Text>
                            <View style={styles.marksContainer}>
                                <Text style={styles.courseMarks}>{profile.marks}</Text>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '85%' }]} />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f8faf9' },
    container: { padding: 20, gap: 16 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    title: { fontSize: 26, fontWeight: '800', color: '#003629' },
    subtitle: { color: '#707974', fontSize: 15, marginTop: 4 },
    statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    statIcon: { marginBottom: 8 },
    statLabel: { fontSize: 12, color: '#707974', textTransform: 'uppercase', fontWeight: '600' },
    statValue: { fontSize: 22, fontWeight: '800', color: '#003629', marginTop: 4 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontWeight: '800', fontSize: 18, color: '#003629' },
    emptyContainer: { alignItems: 'center', paddingVertical: 30, gap: 12 },
    emptyText: { color: '#707974', fontSize: 14 },
    courseRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f2f4f3' },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    courseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    courseTitle: { fontWeight: '800', fontSize: 16, color: '#003629' },
    courseGrade: {
        backgroundColor: '#e6f7f1',
        color: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: '800',
        fontSize: 14,
        overflow: 'hidden'
    },
    courseMeta: { color: '#707974', marginTop: 6, fontSize: 13, marginLeft: 24 },
    marksContainer: { marginTop: 12, marginLeft: 24 },
    courseMarks: { fontWeight: '800', color: '#003629', fontSize: 15, marginBottom: 6 },
    progressBar: { height: 6, backgroundColor: '#f2f4f3', borderRadius: 3 },
    progressFill: { height: 6, backgroundColor: '#10b981', borderRadius: 3 },
});
