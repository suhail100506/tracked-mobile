import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const kpis: Array<{ label: string; value: string; trend: string }> = [];
const chartPoints: number[] = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Institutional Analytics</Text>
                <Text style={styles.subtitle}>No analytics data available.</Text>

                <View style={styles.kpiGrid}>
                    {kpis.length === 0 ? (
                        <Text style={styles.emptyText}>No KPI data available.</Text>
                    ) : (
                        kpis.map((kpi) => (
                            <View key={kpi.label} style={styles.kpiCard}>
                                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                                <Text style={styles.kpiValue}>{kpi.value}</Text>
                                <Text style={styles.kpiTrend}>{kpi.trend}</Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Academic Performance Trajectory</Text>
                    {chartPoints.length === 0 ? (
                        <Text style={styles.emptyText}>No chart data available.</Text>
                    ) : (
                        <View style={styles.fakeChart}>
                            {chartPoints.map((height, index) => (
                                <View key={`${height}-${index}`} style={[styles.chartBar, { height }]} />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Attendance vs. Performance</Text>
                    <Text style={styles.muted}>No correlation data available.</Text>
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
    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    kpiCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    kpiLabel: { fontSize: 11, color: '#707974', textTransform: 'uppercase' },
    kpiValue: { fontSize: 18, fontWeight: '700', color: '#003629', marginTop: 6 },
    kpiTrend: { color: '#1B4D3E', marginTop: 4, fontSize: 12 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    cardTitle: { fontWeight: '800', color: '#003629', marginBottom: 8 },
    fakeChart: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', height: 90 },
    chartBar: { flex: 1, backgroundColor: '#baeed9', borderRadius: 6 },
    muted: { color: '#707974', fontSize: 12, marginBottom: 8 },
    scatterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    scatterDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(27,77,62,0.5)' },
    emptyText: { color: '#707974', fontSize: 12, marginTop: 6 },
});
