import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const courses: Array<{ title: string; code: string; credits: number; marks: number; grade: string }> = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Academic Record</Text>
                <Text style={styles.subtitle}>No grades available.</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Term GPA</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Cum. GPA</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Credits Earned</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Class Rank</Text>
                        <Text style={styles.statValue}>--</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Mid-Term Assessment Grades</Text>
                    {courses.length === 0 ? (
                        <Text style={styles.emptyText}>No grade entries yet.</Text>
                    ) : (
                        courses.map((course) => (
                            <View key={course.code} style={styles.courseRow}>
                                <View style={styles.courseHeader}>
                                    <Text style={styles.courseTitle}>{course.title}</Text>
                                    <Text style={styles.courseGrade}>{course.grade}</Text>
                                </View>
                                <Text style={styles.courseMeta}>
                                    {course.code} • {course.credits} credits
                                </Text>
                                <Text style={styles.courseMarks}>{course.marks}/100</Text>
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
    statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    statLabel: { fontSize: 11, color: '#707974', textTransform: 'uppercase' },
    statValue: { fontSize: 18, fontWeight: '700', color: '#003629', marginTop: 6 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    cardTitle: { fontWeight: '800', color: '#003629', marginBottom: 10 },
    courseRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f2f4f3' },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    courseTitle: { fontWeight: '700', color: '#003629' },
    courseGrade: {
        backgroundColor: '#baeed9',
        color: '#1B4D3E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontWeight: '700',
    },
    courseMeta: { color: '#707974', marginTop: 4 },
    courseMarks: { fontWeight: '700', color: '#003629', marginTop: 4 },
    emptyText: { color: '#707974', fontSize: 12, marginTop: 6 },
});
