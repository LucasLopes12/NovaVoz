import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getSkillColor, getSkillColorWithAlpha } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

export default function TaskDetailScreen({ task, onToggleTask, onSaveReflection }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const [reflection, setReflection] = useState(task?.reflection || '');
    const [reflectionStatus, setReflectionStatus] = useState('idle');

    useEffect(() => {
        setReflection(task?.reflection || '');
        setReflectionStatus('idle');
    }, [task?.id, task?.reflection]);

    if (!task) return <View style={styles.empty}><Text style={styles.emptyText}>Missão não encontrada.</Text></View>;

    const color = getSkillColor(task.skill);
    const xp = (task.difficulty || 1) * 10;
    const steps = [
        'Escolha um momento em que você se sinta confortável.',
        `Faça a missão: “${task.title}”.`,
        'Respire, observe como se sentiu e marque como concluída.',
    ];
    const savedReflection = task.reflection || '';
    const reflectionChanged = reflection.trim() !== savedReflection;

    const saveReflection = async () => {
        setReflectionStatus('saving');
        const result = await onSaveReflection(task.id, reflection);
        setReflectionStatus(result?.savedLocally ? 'local' : 'saved');
    };

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

            {task.completed && (
                <View style={styles.reflectionCard}>
                    <Text style={styles.reflectionTitle}>Escreva como você se sentiu fazendo essa tarefa</Text>
                    <Text style={styles.reflectionSubtitle}>Opcional, serve de apoio no futuro</Text>
                    <TextInput
                        accessibilityLabel="Como você se sentiu fazendo essa tarefa"
                        multiline
                        maxLength={600}
                        onChangeText={(text) => { setReflection(text); setReflectionStatus('idle'); }}
                        placeholder="Ex.: No começo fiquei nervoso, mas depois a conversa ficou mais natural..."
                        placeholderTextColor={palette.textSecondary}
                        style={styles.reflectionInput}
                        textAlignVertical="top"
                        value={reflection}
                    />
                    <View style={styles.reflectionFooter}>
                        <Text style={styles.characterCount}>{reflection.length}/600</Text>
                        <Pressable
                            accessibilityRole="button"
                            disabled={!reflectionChanged || reflectionStatus === 'saving'}
                            onPress={saveReflection}
                            style={({ pressed }) => [styles.saveReflectionButton,
                                (!reflectionChanged || reflectionStatus === 'saving') && styles.saveReflectionDisabled,
                                pressed && reflectionChanged && styles.saveReflectionPressed]}
                        >
                            {reflectionStatus === 'saving'
                                ? <ActivityIndicator size="small" color="#FFFFFF" />
                                : <Text style={styles.saveReflectionText}>{savedReflection ? 'SALVAR ALTERAÇÃO' : 'SALVAR REFLEXÃO'}</Text>}
                        </Pressable>
                    </View>
                    {reflectionStatus === 'saved' && <Text style={styles.reflectionSaved}>✓ Reflexão salva e sincronizada</Text>}
                    {reflectionStatus === 'local' && <Text style={styles.reflectionSaved}>✓ Salva neste aparelho</Text>}
                </View>
            )}

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
    reflectionCard: { backgroundColor: palette.surface, borderRadius: 18, borderWidth: 2,
        borderColor: palette.border, borderBottomWidth: 5, borderBottomColor: palette.shadow,
        padding: 16, marginBottom: 14 },
    reflectionTitle: { color: palette.textPrimary, fontSize: 17, lineHeight: 22, fontWeight: '900' },
    reflectionSubtitle: { color: palette.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3, marginBottom: 12 },
    reflectionInput: { minHeight: 112, color: palette.textPrimary, backgroundColor: palette.background,
        borderWidth: 2, borderColor: palette.border, borderRadius: 13, padding: 12, fontSize: 14,
        lineHeight: 20, fontWeight: '600' },
    reflectionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 12 },
    characterCount: { color: palette.textSecondary, fontSize: 10, fontWeight: '700' },
    saveReflectionButton: { minWidth: 142, minHeight: 40, backgroundColor: palette.info, borderRadius: 11,
        borderBottomWidth: 4, borderBottomColor: '#168ECB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
    saveReflectionDisabled: { opacity: 0.45 },
    saveReflectionPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
    saveReflectionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },
    reflectionSaved: { color: palette.accentStrong, fontSize: 11, fontWeight: '800', textAlign: 'right', marginTop: 8 },
    communityRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: palette.surface,
        borderRadius: 16, paddingVertical: 14, borderWidth: 2, borderColor: palette.border, marginBottom: 16 },
    communityValue: { color: palette.textPrimary, textAlign: 'center', fontWeight: '900', fontSize: 16 },
    communityLabel: { color: palette.textSecondary, textAlign: 'center', fontSize: 9, marginTop: 3 },
    divider: { width: 1, height: 28, backgroundColor: palette.border },
    actionButton: { borderRadius: 14, alignItems: 'center', paddingVertical: 15, borderBottomWidth: 5 },
    actionText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
});
