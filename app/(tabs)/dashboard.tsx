import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const gpaPoints: number[] = [];
const scheduleItems: Array<{ time: string; title: string; location: string }> = [];
const shortcuts: string[] = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <Text style={styles.heroTag}>Current Status</Text>
                    <Text style={styles.heroTitle}>Excellent Standing</Text>
                    <Text style={styles.heroSub}>No summary data available yet.</Text>
                    <View style={styles.heroStats}>
                        <View style={styles.heroStat}>
                            <Text style={styles.heroStatLabel}>Term GPA</Text>
                            <Text style={styles.heroStatValue}>--</Text>
                        </View>
                        <View style={styles.heroStat}>
                            <Text style={styles.heroStatLabel}>Attendance</Text>
                            <Text style={styles.heroStatValue}>--</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>GPA Progression</Text>
                    {gpaPoints.length === 0 ? (
                        <Text style={styles.emptyText}>No GPA data available.</Text>
                    ) : (
                        <View style={styles.fakeChart}>
                            {gpaPoints.map((height, index) => (
                                <View key={`${height}-${index}`} style={[styles.chartBar, { height }]} />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.alertCard}>
                    <Text style={styles.cardTitle}>Upcoming Deadline</Text>
                    <Text style={styles.muted}>No upcoming deadlines.</Text>
                    <View style={styles.alertPanel}>
                        <Text style={styles.alertTitle}>No pending submissions</Text>
                        <Text style={styles.muted}>You're all caught up.</Text>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>Check Updates</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Schedule</Text>
                    {scheduleItems.length === 0 ? (
                        <Text style={styles.emptyText}>No classes scheduled.</Text>
                    ) : (
                        scheduleItems.map((item, index) => (
                            <View key={`${item.title}-${index}`} style={styles.scheduleItem}>
                                <View style={styles.scheduleDot} />
                                <View>
                                    <Text style={styles.scheduleTime}>{item.time}</Text>
                                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                                    <Text style={styles.muted}>{item.location}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Quick Shortcuts</Text>
                    <View style={styles.quickGrid}>
                        {shortcuts.length === 0 ? (
                            <Text style={styles.emptyText}>No shortcuts configured.</Text>
                        ) : (
                            shortcuts.map((label) => (
                                <TouchableOpacity key={label} style={styles.quickItem}>
                                    <Text style={styles.quickText}>{label}</Text>
                                </TouchableOpacity>
                            ))
                        )}
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
        gap: 16,
    },
    hero: {
        backgroundColor: '#1B4D3E',
        borderRadius: 20,
        padding: 20,
    },
    heroTag: {
        color: '#ffffff',
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: 26,
        fontWeight: '800',
        marginTop: 8,
    },
    heroSub: {
        color: '#baeed9',
        marginTop: 6,
    },
    heroStats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    heroStat: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: 12,
        flex: 1,
    },
    heroStatLabel: {
        color: '#baeed9',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    heroStatValue: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        marginTop: 6,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    cardTitle: {
        color: '#003629',
        fontWeight: '800',
        marginBottom: 8,
    },
    muted: {
        color: '#707974',
        fontSize: 12,
    },
    emptyText: {
        color: '#707974',
        fontSize: 12,
        marginTop: 6,
    },
    fakeChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        height: 90,
        marginTop: 10,
    },
    chartBar: {
        flex: 1,
        backgroundColor: '#baeed9',
        borderRadius: 6,
    },
    alertCard: {
        backgroundColor: '#fffbf0',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAB308',
    },
    alertPanel: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
    },
    alertTitle: {
        fontWeight: '700',
        color: '#003629',
    },
    primaryButton: {
        marginTop: 10,
        backgroundColor: '#1B4D3E',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: '700',
    },
    scheduleItem: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    scheduleDot: {
        width: 6,
        borderRadius: 3,
        backgroundColor: '#1B4D3E',
    },
    scheduleDotMuted: {
        width: 6,
        borderRadius: 3,
        backgroundColor: '#c0c9c3',
    },
    scheduleTime: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1B4D3E',
    },
    scheduleTimeMuted: {
        fontSize: 12,
        fontWeight: '700',
        color: '#707974',
    },
    scheduleTitle: {
        fontWeight: '700',
        color: '#003629',
    },
    scheduleMuted: {
        opacity: 0.7,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 6,
    },
    quickItem: {
        width: '48%',
        backgroundColor: '#f2f4f3',
        borderRadius: 12,
        padding: 12,
    },
    quickText: {
        fontWeight: '700',
        color: '#003629',
    },
});
