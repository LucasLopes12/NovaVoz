import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LearningPath from '../components/LearningPath';
import { learningLevels } from '../models/tasks';
import { useThemePalette } from '../theme/themeContext';

export default function HomeScreen({ tasks, onTaskPress, xp, streak }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const completed = tasks.filter((task) => task.completed).length;
    const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const nextTask = tasks.find((task) => !task.completed);
    const currentLevel = nextTask?.level || learningLevels.length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeRow}>
                <View style={styles.welcomeCopy}>
                    <Text style={styles.eyebrow}>TREINO DE HOJE</Text>
                    <Text style={styles.title}>Vamos soltar essa voz?</Text>
                    <Text style={styles.subtitle}>{nextTask ? 'Uma pequena missão pode mudar seu dia.' : 'Trilha completa. Mandou muito bem!'}</Text>
                </View>
                <View style={styles.levelBadge}><Text style={styles.levelNumber}>{currentLevel}</Text><Text style={styles.levelLabel}>NÍVEL</Text></View>
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

            {learningLevels.map((level) => {
                const levelTasks = tasks.filter((task) => task.level === level.id);
                const levelCompleted = levelTasks.filter((task) => task.completed).length;
                const isComplete = levelTasks.length > 0 && levelCompleted === levelTasks.length;
                const isLocked = level.id > currentLevel;
                const headerColor = isComplete ? palette.success : isLocked ? palette.surfaceSoft : level.color;
                const headerShadow = isComplete ? palette.accentStrong : isLocked ? palette.shadow : level.shadowColor;

                return (
                    <View key={level.id} style={styles.levelSection}>
                        <View style={[styles.unitHeader, { backgroundColor: headerColor, borderBottomColor: headerShadow }]}>
                            <View style={styles.unitCopy}>
                                <View style={styles.unitEyebrowRow}>
                                    <Text style={[styles.unitEyebrow, isLocked && styles.lockedHeaderText]}>NÍVEL {level.id}</Text>
                                    <Text style={[styles.unitProgress, isLocked && styles.lockedHeaderText]}>{levelCompleted}/{levelTasks.length}</Text>
                                </View>
                                <Text style={[styles.unitTitle, isLocked && styles.lockedHeaderTitle]}>{level.title}</Text>
                                <Text style={[styles.unitDescription, isLocked && styles.lockedHeaderText]}>{level.description}</Text>
                            </View>
                            <Text style={[styles.unitIcon, isLocked && styles.lockedIcon]}>{isLocked ? '🔒' : isComplete ? '✓' : level.icon}</Text>
                        </View>

                        <LearningPath tasks={levelTasks} currentTaskId={nextTask?.id} onTaskPress={onTaskPress} />
                    </View>
                );
            })}
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
    levelSection: { marginBottom: 10 },
    unitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 18, paddingVertical: 15, borderRadius: 18, borderBottomWidth: 5,
        marginBottom: 8 },
    unitCopy: { flex: 1, paddingRight: 12 },
    unitEyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    unitEyebrow: { color: '#E8FFD9', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    unitProgress: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
    unitTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
    unitDescription: { color: '#FFFFFF', fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 4, opacity: 0.9 },
    unitIcon: { fontSize: 30 },
    lockedHeaderTitle: { color: palette.textSecondary },
    lockedHeaderText: { color: palette.textSecondary },
    lockedIcon: { opacity: 0.6 },
});
