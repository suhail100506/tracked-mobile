import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useProfile } from '../../../context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

const gpaPoints: number[] = [40, 50, 45, 60, 80, 85];
const scheduleItems: Array<{ time: string; title: string; location: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { time: '09:00 AM', title: 'Data Structures', location: 'Room 302', icon: 'desktop-outline' },
    { time: '11:30 AM', title: 'Calculus IV', location: 'Lecture Hall B', icon: 'calculator-outline' }
];

const shortcuts: Array<{ label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { label: 'Library', icon: 'library-outline' },
    { label: 'Fees', icon: 'card-outline' },
    { label: 'Tutors', icon: 'chatbubbles-outline' },
    { label: 'Meals', icon: 'fast-food-outline' },
];

export default function Screen() {
    const { profile } = useProfile();

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.heroHeader}>
                        <View>
                            <Text style={styles.heroTag}>Welcome back,</Text>
                            <Text style={styles.heroTitle}>{profile.fullName || 'Student'}</Text>
                        </View>
                        <View style={styles.profileAvatar}>
                            <Ionicons name="person" size={24} color="#1B4D3E" />
                        </View>
                    </View>

                    <Text style={styles.heroSub}>
                        {profile.department ? `Dept of ${profile.department}` : 'Academic Portal'} | Roll: {profile.rollNo || 'N/A'}
                    </Text>

                    <View style={styles.heroStats}>
                        <View style={styles.heroStat}>
                            <Ionicons name="school-outline" size={16} color="#baeed9" style={{ marginBottom: 4 }} />
                            <Text style={styles.heroStatLabel}>Term CGPA</Text>
                            <Text style={styles.heroStatValue}>{profile.cgpa || '--'}</Text>
                        </View>
                        <View style={styles.heroStat}>
                            <Ionicons name="calendar-outline" size={16} color="#baeed9" style={{ marginBottom: 4 }} />
                            <Text style={styles.heroStatLabel}>Attendance</Text>
                            <Text style={styles.heroStatValue}>{profile.attendance ? `${profile.attendance}%` : '--'}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, styles.shadowCard]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Upcoming Deadline</Text>
                        <Ionicons name="alert-circle" size={20} color="#EAB308" />
                    </View>
                    <View style={styles.alertPanel}>
                        <Text style={styles.alertTitle}>AI Project Submission</Text>
                        <Text style={styles.muted}>Due tomorrow at 11:59 PM</Text>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.card, styles.shadowCard]}>
                    <Text style={styles.cardTitle}>Today's Schedule</Text>
                    {scheduleItems.length === 0 ? (
                        <Text style={styles.emptyText}>No classes scheduled.</Text>
                    ) : (
                        scheduleItems.map((item, index) => (
                            <View key={index} style={styles.scheduleItem}>
                                <View style={styles.scheduleIconBox}>
                                    <Ionicons name={item.icon} size={20} color="#1B4D3E" />
                                </View>
                                <View style={styles.scheduleContent}>
                                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                                    <Text style={styles.muted}>{item.time} • {item.location}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={[styles.card, styles.shadowCard]}>
                    <Text style={styles.cardTitle}>Quick Shortcuts</Text>
                    <View style={styles.quickGrid}>
                        {shortcuts.map((item) => (
                            <TouchableOpacity key={item.label} style={styles.quickItem}>
                                <Ionicons name={item.icon} size={24} color="#1B4D3E" style={{ marginBottom: 8 }} />
                                <Text style={styles.quickText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
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
        borderRadius: 24,
        padding: 24,
        shadowColor: "#1B4D3E",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    heroTag: {
        color: '#baeed9',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    profileAvatar: {
        backgroundColor: '#baeed9',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '800',
        marginTop: 4,
    },
    heroSub: {
        color: '#ffffff',
        opacity: 0.8,
        marginTop: 8,
        fontSize: 14,
    },
    heroStats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    heroStat: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 14,
        flex: 1,
    },
    heroStatLabel: {
        color: '#baeed9',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    heroStatValue: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
    },
    shadowCard: {
        borderWidth: 1,
        borderColor: '#f0f3f1',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        color: '#003629',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },
    muted: {
        color: '#707974',
        fontSize: 13,
    },
    emptyText: {
        color: '#707974',
        fontSize: 14,
    },
    alertPanel: {
        backgroundColor: '#fffbf0',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fce38a',
    },
    alertTitle: {
        fontWeight: '800',
        color: '#8a6d3b',
        fontSize: 16,
        marginBottom: 4,
    },
    primaryButton: {
        marginTop: 16,
        backgroundColor: '#003629',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f4f3',
    },
    scheduleIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#ebf4f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleContent: { flex: 1 },
    scheduleTitle: {
        fontWeight: '700',
        color: '#003629',
        fontSize: 16,
        marginBottom: 2,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickItem: {
        width: '48%',
        backgroundColor: '#fafcfb',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f3f1',
    },
    quickText: {
        fontWeight: '700',
        color: '#003629',
        fontSize: 14,
    },
});
