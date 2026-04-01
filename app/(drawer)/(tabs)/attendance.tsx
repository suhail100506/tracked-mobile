import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '../../../context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

const days: number[] = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30];

export default function Screen() {
    const { profile } = useProfile();
    const attendanceVal = parseFloat(profile.attendance) || 0;

    const presentCount = Math.round(30 * (attendanceVal / 100));
    const absentCount = attendanceVal > 0 ? 30 - presentCount : 0;

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Attendance Record</Text>
                        <Text style={styles.subtitle}>Current Semester Overview</Text>
                    </View>
                    <Ionicons name="calendar" size={40} color="#1B4D3E" opacity={0.2} />
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconBadge}>
                            <Ionicons name="checkmark" size={16} color="#10b981" />
                        </View>
                        <Text style={styles.statLabel}>Total Present</Text>
                        <Text style={styles.statValue}>{attendanceVal > 0 ? presentCount : '--'}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBadge, { backgroundColor: '#ffe4e6' }]}>
                            <Ionicons name="close" size={16} color="#ef4444" />
                        </View>
                        <Text style={styles.statLabel}>Total Absent</Text>
                        <Text style={styles.statValue}>{attendanceVal > 0 ? absentCount : '--'}</Text>
                    </View>
                    <View style={[styles.statCard, styles.statPrimary]}>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="pie-chart" size={16} color="#ffffff" />
                        </View>
                        <Text style={styles.statLabelLight}>Current Rate</Text>
                        <Text style={styles.statValueLight}>{profile.attendance ? profile.attendance + '%' : '--'}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent Classes Tracker</Text>
                    {attendanceVal === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={40} color="#c0c9c3" />
                            <Text style={styles.emptyText}>Update your profile to see calendar data.</Text>
                        </View>
                    ) : (
                        <View style={styles.calendarGrid}>
                            {days.map((day, index) => {
                                const isPresent = index < presentCount; // Predictable distribution
                                return (
                                    <View key={day} style={[styles.day, isPresent ? styles.dayPresent : styles.dayAbsent]}>
                                        <Text style={[styles.dayText, !isPresent && styles.dayTextAbsent]}>{day}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Subject Breakdown</Text>
                    {attendanceVal === 0 ? (
                        <Text style={styles.emptyText}>No subject breakdown available.</Text>
                    ) : (
                        <View style={styles.subjectRow}>
                            <View style={styles.subjectHeader}>
                                <Text style={styles.subjectLabel}>Core Department Subjects</Text>
                                <Text style={styles.subjectValue}>{profile.attendance}%</Text>
                            </View>
                            <View style={styles.barTrack}>
                                <View style={[styles.barFill, { width: profile.attendance + '%' }]} />
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
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    title: { fontSize: 26, fontWeight: '800', color: '#003629' },
    subtitle: { color: '#707974', fontSize: 15, marginTop: 4 },
    statsRow: { gap: 12, flexDirection: 'row' },
    statCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        flex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e6f7f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statPrimary: { backgroundColor: '#1B4D3E', borderColor: '#1B4D3E', shadowColor: '#1B4D3E' },
    statLabel: { color: '#707974', fontSize: 11, textTransform: 'uppercase', fontWeight: '700' },
    statLabelLight: { color: '#baeed9', fontSize: 11, textTransform: 'uppercase', fontWeight: '700' },
    statValue: { fontSize: 22, fontWeight: '800', color: '#003629', marginTop: 4 },
    statValueLight: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginTop: 4 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8e5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: { fontWeight: '800', fontSize: 18, color: '#003629', marginBottom: 16 },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' },
    day: {
        width: '12%',
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayPresent: { backgroundColor: '#e6f7f1', borderWidth: 1, borderColor: '#a3e4cd' },
    dayAbsent: { backgroundColor: '#fff1f2', borderWidth: 1, borderColor: '#fecdd3' },
    dayText: { fontSize: 13, fontWeight: '700', color: '#059669' },
    dayTextAbsent: { color: '#e11d48' },
    emptyContainer: { alignItems: 'center', paddingVertical: 20, gap: 12 },
    emptyText: { color: '#707974', fontSize: 14, textAlign: 'center' },
    subjectRow: { marginBottom: 12, marginTop: 4 },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    subjectLabel: { color: '#003629', fontWeight: '700', fontSize: 15 },
    subjectValue: { color: '#1B4D3E', fontWeight: '800', fontSize: 15 },
    barTrack: { height: 10, backgroundColor: '#f2f4f3', borderRadius: 999 },
    barFill: { height: 10, backgroundColor: '#10b981', borderRadius: 999 },
});
