import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const days: number[] = [];
const subjects: Array<{ label: string; value: number }> = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Attendance Record</Text>
                <Text style={styles.subtitle}>No attendance data available.</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Present</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Absent</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                    <View style={[styles.statCard, styles.statPrimary]}>
                        <Text style={styles.statLabelLight}>Current Rate</Text>
                        <Text style={styles.statValueLight}>--</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>November 2024</Text>
                    {days.length === 0 ? (
                        <Text style={styles.emptyText}>No calendar data available.</Text>
                    ) : (
                        <View style={styles.calendarGrid}>
                            {days.map((day) => (
                                <View key={day} style={[styles.day, styles.dayPresent]}>
                                    <Text style={styles.dayText}>{day}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>By Subject</Text>
                    {subjects.length === 0 ? (
                        <Text style={styles.emptyText}>No subject breakdown available.</Text>
                    ) : (
                        subjects.map((item) => (
                            <View key={item.label} style={styles.subjectRow}>
                                <View style={styles.subjectHeader}>
                                    <Text style={styles.subjectLabel}>{item.label}</Text>
                                    <Text style={styles.subjectValue}>{item.value}%</Text>
                                </View>
                                <View style={styles.barTrack}>
                                    <View style={[styles.barFill, { width: `${item.value}%` }]} />
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f8faf9' },
    container: { padding: 20, gap: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#003629' },
    subtitle: { color: '#707974' },
    statsRow: { gap: 12 },
    statCard: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    statPrimary: { backgroundColor: '#1B4D3E', borderColor: '#1B4D3E' },
    statLabel: { color: '#707974', fontSize: 11, textTransform: 'uppercase' },
    statLabelLight: { color: '#baeed9', fontSize: 11, textTransform: 'uppercase' },
    statValue: { fontSize: 18, fontWeight: '700', color: '#003629', marginTop: 4 },
    statValueLight: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginTop: 4 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    cardTitle: { fontWeight: '800', color: '#003629', marginBottom: 10 },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    day: {
        width: '12%',
        aspectRatio: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayPresent: { backgroundColor: 'rgba(27,77,62,0.1)' },
    dayAbsent: { backgroundColor: 'rgba(168,54,75,0.15)' },
    dayText: { fontSize: 12, fontWeight: '700', color: '#003629' },
    emptyText: { color: '#707974', fontSize: 12, marginTop: 6 },
    subjectRow: { marginBottom: 12 },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    subjectLabel: { color: '#003629', fontWeight: '700' },
    subjectValue: { color: '#1B4D3E', fontWeight: '700' },
    barTrack: { height: 8, backgroundColor: '#f2f4f3', borderRadius: 999, marginTop: 6 },
    barFill: { height: 8, backgroundColor: '#1B4D3E', borderRadius: 999 },
    notice: { color: '#707974', fontSize: 12, marginTop: 8 },
});
