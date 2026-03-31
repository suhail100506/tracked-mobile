import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const reports: Array<{ id: string; name: string; dept: string; metric: string }> = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Reports Generation</Text>
                <Text style={styles.subtitle}>No report data available.</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Export Registry</Text>
                    <View style={styles.exportRow}>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportText}>Download PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportText}>Download Excel</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Refresh Live Data</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Data Preview Ledger</Text>
                    {reports.length === 0 ? (
                        <Text style={styles.emptyText}>No records to display.</Text>
                    ) : (
                        reports.map((item) => (
                            <View key={item.id} style={styles.row}>
                                <View>
                                    <Text style={styles.rowTitle}>{item.name}</Text>
                                    <Text style={styles.rowMeta}>{item.id} • {item.dept}</Text>
                                </View>
                                <Text style={styles.metric}>{item.metric}</Text>
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0c9c3',
    },
    cardTitle: { fontWeight: '800', color: '#003629', marginBottom: 12 },
    exportRow: { flexDirection: 'row', gap: 10 },
    exportButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#c0c9c3',
        alignItems: 'center',
    },
    exportText: { fontWeight: '700', color: '#003629' },
    primaryButton: {
        marginTop: 12,
        backgroundColor: '#1B4D3E',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    primaryButtonText: { color: '#ffffff', fontWeight: '700' },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f4f3',
    },
    rowTitle: { fontWeight: '700', color: '#003629' },
    rowMeta: { color: '#707974', marginTop: 4, fontSize: 12 },
    metric: { fontWeight: '800', color: '#1B4D3E' },
    emptyText: { color: '#707974', fontSize: 12, marginTop: 6 },
});
