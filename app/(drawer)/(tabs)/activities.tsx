import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '../../../context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

export default function Screen() {
    const { profile } = useProfile();
    const hasActivities = profile.activities && profile.activities.trim().length > 0;

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Extracurriculars</Text>
                        <Text style={styles.subtitle}>Tracked from your Personal Profile.</Text>
                    </View>
                    <Ionicons name="football" size={40} color="#1B4D3E" opacity={0.2} />
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="medal-outline" size={24} color="#EAB308" />
                        <Text style={styles.cardTitle}>Your Registered Activities</Text>
                    </View>

                    {!hasActivities ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="body-outline" size={40} color="#c0c9c3" />
                            <Text style={styles.emptyText}>No activities recorded in your profile yet.</Text>
                        </View>
                    ) : (
                        <View style={styles.listItem}>
                            <View style={styles.listIconBox}>
                                <Ionicons name="star" size={20} color="#EAB308" />
                            </View>
                            <Text style={styles.listText}>{profile.activities}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={24} color="#1B4D3E" />
                        <Text style={styles.cardTitle}>Upcoming Events</Text>
                    </View>

                    <View style={styles.eventItem}>
                        <View style={styles.eventDateBox}>
                            <Text style={styles.eventMonth}>OCT</Text>
                            <Text style={styles.eventDay}>24</Text>
                        </View>
                        <View style={styles.eventContent}>
                            <Text style={styles.listTitle}>Annual IT Symposium</Text>
                            <Text style={styles.muted}>Main Auditorium � 10:00 AM</Text>
                        </View>
                    </View>

                    <View style={styles.eventItem}>
                        <View style={styles.eventDateBox}>
                            <Text style={styles.eventMonth}>NOV</Text>
                            <Text style={styles.eventDay}>02</Text>
                        </View>
                        <View style={styles.eventContent}>
                            <Text style={styles.listTitle}>Inter-Department Sports</Text>
                            <Text style={styles.muted}>Campus Grounds � All Day</Text>
                        </View>
                    </View>
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
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    cardTitle: { fontWeight: '800', fontSize: 18, color: '#003629' },
    emptyState: { alignItems: 'center', paddingVertical: 20, gap: 12 },
    emptyText: { color: '#707974', fontSize: 14, textAlign: 'center' },
    listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
    listIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff8e1', alignItems: 'center', justifyContent: 'center' },
    listText: { color: '#003629', fontSize: 16, lineHeight: 24, flex: 1, marginTop: 8 },
    eventItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f2f4f3' },
    eventDateBox: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#ebf4f1', alignItems: 'center', justifyContent: 'center' },
    eventMonth: { fontSize: 12, fontWeight: '800', color: '#1B4D3E' },
    eventDay: { fontSize: 20, fontWeight: '800', color: '#00543f' },
    eventContent: { flex: 1 },
    listTitle: { fontWeight: '800', fontSize: 16, color: '#003629', marginBottom: 4 },
    muted: { color: '#707974', fontSize: 13 },
});
