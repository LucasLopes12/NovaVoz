import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LearningPath from '../components/LearningPath';
import { useThemePalette } from '../theme/themeContext';

export default function HomeScreen({ tasks, onTaskPress, xp, streak }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const completed = tasks.filter((task) => task.completed).length;
    const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const nextTask = tasks.find((task) => !task.completed);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeRow}>
                <View style={styles.welcomeCopy}>
                    <Text style={styles.eyebrow}>TREINO DE HOJE</Text>
                    <Text style={styles.title}>Vamos soltar essa voz?</Text>
                    <Text style={styles.subtitle}>{nextTask ? 'Uma pequena missão pode mudar seu dia.' : 'Trilha completa. Mandou muito bem!'}</Text>
                </View>
                <View style={styles.levelBadge}><Text style={styles.levelNumber}>{Math.floor(xp / 100) + 1}</Text><Text style={styles.levelLabel}>NÍVEL</Text></View>
            </View>

            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Progresso da trilha</Text>
                    <Text style={styles.progressCount}>{completed}/{tasks.length}</Text>
                </View>
                <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percentage}%` }]} /></View>
                <View style={styles.miniStats}>
                    <Text style={styles.miniStat}>🔥 {streak} {streak === 1 ? 'dia' : 'dias'}</Text>
                    <Text style={styles.miniStat}>⚡ {xp} XP total</Text>
                </View>
            </View>

            <View style={styles.unitHeader}>
                <View>
                    <Text style={styles.unitEyebrow}>UNIDADE 1</Text>
                    <Text style={styles.unitTitle}>Primeiros passos</Text>
                </View>
                <Text style={styles.unitIcon}>💬</Text>
            </View>

            <LearningPath tasks={tasks} onTaskPress={onTaskPress} />
        </ScrollView>
    );
}

const createStyles = (palette) => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 18, paddingBottom: 32 },
    welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
    welcomeCopy: { flex: 1 },
    eyebrow: { color: palette.accentStrong, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 5 },
    title: { color: palette.textPrimary, fontSize: 25, lineHeight: 30, fontWeight: '900' },
    subtitle: { color: palette.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 5 },
    levelBadge: { width: 64, height: 64, borderRadius: 18, backgroundColor: palette.info, alignItems: 'center',
        justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#168ECB' },
    levelNumber: { color: '#FFFFFF', fontSize: 23, lineHeight: 25, fontWeight: '900' },
    levelLabel: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
    progressCard: { backgroundColor: palette.surface, padding: 16, borderWidth: 2, borderColor: palette.border,
        borderBottomWidth: 5, borderBottomColor: palette.shadow, borderRadius: 18, marginBottom: 22 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    progressTitle: { color: palette.textPrimary, fontSize: 15, fontWeight: '800' },
    progressCount: { color: palette.accentStrong, fontSize: 15, fontWeight: '900' },
    progressTrack: { height: 14, borderRadius: 7, backgroundColor: palette.surfaceSoft, overflow: 'hidden', padding: 3 },
    progressFill: { height: 8, borderRadius: 4, backgroundColor: palette.accent },
    miniStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 },
    miniStat: { color: palette.textSecondary, fontSize: 12, fontWeight: '700' },
    unitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: palette.accent,
        paddingHorizontal: 18, paddingVertical: 15, borderRadius: 18, borderBottomWidth: 5,
        borderBottomColor: palette.accentStrong, marginBottom: 16 },
    unitEyebrow: { color: '#E8FFD9', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    unitTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
    unitIcon: { fontSize: 30 },
});
