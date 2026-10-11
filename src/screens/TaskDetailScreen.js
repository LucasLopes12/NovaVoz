import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getSkillColor, getSkillColorWithAlpha } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

export default function TaskDetailScreen({ task, onToggleTask }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);

    if (!task) return <View style={styles.empty}><Text style={styles.emptyText}>Missão não encontrada.</Text></View>;

    const color = getSkillColor(task.skill);
    const xp = (task.difficulty || 1) * 10;
    const steps = [
        'Escolha um momento em que você se sinta confortável.',
        `Faça a missão: “${task.title}”.`,
        'Respire, observe como se sentiu e marque como concluída.',
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.hero, { backgroundColor: getSkillColorWithAlpha(task.skill, 0.18), borderColor: color }]}>
                <View style={[styles.heroIcon, { backgroundColor: color }]}><Text style={styles.heroIconText}>💬</Text></View>
                <Text style={[styles.eyebrow, { color }]}>MISSÃO DE {task.skill.toUpperCase()}</Text>
                <Text style={styles.title}>{task.title}</Text>
                <View style={styles.rewardsRow}>
                    <View style={styles.rewardPill}><Text style={styles.rewardText}>⚡ {xp} XP</Text></View>
                    <View style={styles.rewardPill}><Text style={styles.rewardText}>⏱ 5–10 min</Text></View>
                    <View style={styles.rewardPill}><Text style={styles.rewardText}>● {task.difficulty}/5</Text></View>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Como completar</Text>
                {steps.map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                        <View style={[styles.stepNumber, { backgroundColor: color }]}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>💡</Text>
                <View style={styles.tipCopy}>
                    <Text style={styles.tipTitle}>Dica da Nova</Text>
                    <Text style={styles.tipText}>Não busque perfeição. A meta é praticar um pouco, celebrar a tentativa e repetir amanhã.</Text>
                </View>
            </View>

            <View style={styles.communityRow}>
                <View><Text style={styles.communityValue}>{task.usersCompleted ?? 181}</Text><Text style={styles.communityLabel}>pessoas fizeram</Text></View>
                <View style={styles.divider} />
                <View><Text style={styles.communityValue}>{Number(task.rating ?? 4.9).toFixed(1)} ★</Text><Text style={styles.communityLabel}>avaliação</Text></View>
                <View style={styles.divider} />
                <View><Text style={styles.communityValue}>{task.completionRate ?? 76}%</Text><Text style={styles.communityLabel}>concluíram</Text></View>
            </View>

            <Pressable accessibilityRole="button" onPress={() => onToggleTask(task.id)}
                style={[styles.actionButton, { backgroundColor: task.completed ? palette.surfaceSoft : color,
                    borderBottomColor: task.completed ? palette.shadow : palette.accentStrong }]}>
                <Text style={[styles.actionText, task.completed && { color: palette.textSecondary }]}>
                    {task.completed ? 'MARCAR COMO PENDENTE' : 'CONCLUIR MISSÃO'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const createStyles = (palette) => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 18, paddingBottom: 36 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background },
    emptyText: { color: palette.textSecondary },
    hero: { alignItems: 'center', borderRadius: 22, borderWidth: 2, borderBottomWidth: 6, padding: 20, marginBottom: 16 },
    heroIcon: { width: 66, height: 66, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
    heroIconText: { fontSize: 32 },
    eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 7 },
    title: { color: palette.textPrimary, fontSize: 25, lineHeight: 31, fontWeight: '900', textAlign: 'center' },
    rewardsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 16 },
    rewardPill: { backgroundColor: palette.surface, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
    rewardText: { color: palette.textSecondary, fontSize: 11, fontWeight: '800' },
    sectionCard: { backgroundColor: palette.surface, borderRadius: 18, borderWidth: 2, borderColor: palette.border,
        borderBottomWidth: 5, borderBottomColor: palette.shadow, padding: 16, marginBottom: 14 },
    sectionTitle: { color: palette.textPrimary, fontSize: 18, fontWeight: '900', marginBottom: 14 },
    stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    stepNumber: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
    stepNumberText: { color: '#FFFFFF', fontWeight: '900' },
    stepText: { flex: 1, color: palette.textSecondary, fontSize: 14, lineHeight: 20, fontWeight: '600' },
    tipCard: { flexDirection: 'row', backgroundColor: '#FFF5CC', borderRadius: 18, padding: 15,
        borderWidth: 2, borderColor: '#FFE066', marginBottom: 14 },
    tipIcon: { fontSize: 27, marginRight: 11 }, tipCopy: { flex: 1 },
    tipTitle: { color: '#765B00', fontWeight: '900', fontSize: 14, marginBottom: 4 },
    tipText: { color: '#765B00', fontSize: 13, lineHeight: 19, fontWeight: '600' },
    communityRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: palette.surface,
        borderRadius: 16, paddingVertical: 14, borderWidth: 2, borderColor: palette.border, marginBottom: 16 },
    communityValue: { color: palette.textPrimary, textAlign: 'center', fontWeight: '900', fontSize: 16 },
    communityLabel: { color: palette.textSecondary, textAlign: 'center', fontSize: 9, marginTop: 3 },
    divider: { width: 1, height: 28, backgroundColor: palette.border },
    actionButton: { borderRadius: 14, alignItems: 'center', paddingVertical: 15, borderBottomWidth: 5 },
    actionText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
});
