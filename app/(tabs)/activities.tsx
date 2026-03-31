import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const events: Array<{ title: string; date: string; place: string }> = [];
const clubs: Array<{ name: string; meta: string }> = [];

export default function Screen() {
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Activities & Clubs</Text>
                <Text style={styles.subtitle}>No activities available.</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Upcoming Events</Text>
                    {events.length === 0 ? (
                        <Text style={styles.emptyText}>No events scheduled.</Text>
                    ) : (
                        events.map((event) => (
                            <View key={event.title} style={styles.listItem}>
                                <Text style={styles.listTitle}>{event.title}</Text>
                                <Text style={styles.muted}>
                                    {event.date} • {event.place}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Registered Clubs</Text>
                    {clubs.length === 0 ? (
                        <Text style={styles.emptyText}>No clubs available.</Text>
                    ) : (
                        clubs.map((club) => (
                            <View key={club.name} style={styles.listItem}>
                                <Text style={styles.listTitle}>{club.name}</Text>
                                <Text style={styles.muted}>{club.meta}</Text>
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
    cardTitle: { fontWeight: '800', color: '#003629', marginBottom: 8 },
    listItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f2f4f3' },
    listTitle: { fontWeight: '700', color: '#003629' },
    muted: { color: '#707974', marginTop: 4 },
    emptyText: { color: '#707974', marginTop: 4, fontSize: 12 },
});
