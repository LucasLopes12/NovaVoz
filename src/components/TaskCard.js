import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemePalette } from '../theme/themeContext';

export default function TaskCard({ index, title, skill, difficulty, completed, onPress, onToggleTask, skillColor }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const xp = (difficulty || 1) * 10;

    return (
        <View style={styles.pathRow}>
            <View style={styles.pathColumn}>
                <View style={[styles.node, { backgroundColor: completed ? palette.success : skillColor,
                    borderColor: completed ? palette.accentStrong : palette.shadow }]}>
                    <Text style={styles.nodeText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={[styles.pathLine, completed && { backgroundColor: palette.success }]} />
            </View>

            <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [
                styles.card, completed && styles.completedCard, pressed && styles.pressed,
            ]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.skill, { color: skillColor }]}>{skill.toUpperCase()}</Text>
                    <View style={[styles.statusPill, completed && styles.completedPill]}>
                        <Text style={[styles.statusText, completed && styles.completedStatus]}>{completed ? 'FEITA' : `+${xp} XP`}</Text>
                    </View>
                </View>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.footerRow}>
                    <View style={styles.difficultyRow}>
                        {Array.from({ length: 5 }).map((_, itemIndex) => (
                            <View key={itemIndex} style={[styles.difficultyDot,
                                itemIndex < difficulty && { backgroundColor: skillColor }]} />
                        ))}
                    </View>
                    <Pressable accessibilityLabel={completed ? 'Marcar como pendente' : 'Concluir missão'}
                        onPress={(event) => { event?.stopPropagation?.(); onToggleTask?.(); }}
                        style={[styles.actionButton, { backgroundColor: completed ? palette.surfaceSoft : skillColor,
                            borderBottomColor: completed ? palette.shadow : palette.accentStrong }]}>
                        <Text style={[styles.actionText, completed && { color: palette.textSecondary }]}>
                            {completed ? 'REFAZER' : 'COMEÇAR'}
                        </Text>
                    </Pressable>
                </View>
            </Pressable>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    pathRow: { width: '100%', flexDirection: 'row', alignItems: 'stretch' },
    pathColumn: { width: 56, alignItems: 'center' },
    node: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center',
        borderBottomWidth: 5, marginTop: 8, zIndex: 2 },
    nodeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
    pathLine: { width: 6, flex: 1, minHeight: 86, backgroundColor: palette.border, marginTop: -2 },
    card: { flex: 1, backgroundColor: palette.surface, borderWidth: 2, borderColor: palette.border,
        borderBottomWidth: 5, borderBottomColor: palette.shadow, borderRadius: 18, padding: 15,
        marginLeft: 8, marginBottom: 16 },
    completedCard: { opacity: 0.82 },
    pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 3 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
    skill: { fontSize: 11, letterSpacing: 0.8, fontWeight: '900', flex: 1 },
    statusPill: { backgroundColor: palette.surfaceSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    completedPill: { backgroundColor: palette.accentSoft },
    statusText: { color: palette.info, fontSize: 10, fontWeight: '900' },
    completedStatus: { color: palette.accentStrong },
    title: { color: palette.textPrimary, fontSize: 17, lineHeight: 22, fontWeight: '800', marginBottom: 14 },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    difficultyRow: { flexDirection: 'row', gap: 4 },
    difficultyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.border },
    actionButton: { minWidth: 92, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, alignItems: 'center',
        borderBottomWidth: 3 },
    actionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
});
