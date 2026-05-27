import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { getSkillColor, getSkillColorWithAlpha } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

const defaultComments = [
    {
        author: 'Nina',
        role: 'Mentora',
        comment: 'Essa missão ajuda muito a quebrar o gelo em situações novas.',
    },
    {
        author: 'Bruno',
        role: 'Colega',
        comment: 'Fiquei mais confiante depois de completar essa tarefa.',
    },
    {
        author: 'Paula',
        role: 'Usuária ativa',
        comment: 'Ela deixa o dia mais leve e produtivo.',
    },
];

export default function TaskDetailScreen({ task, onToggleTask, onBack }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);

    if (!task) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Selecione uma tarefa para ver os detalhes.</Text>
            </View>
        );
    }

    const skillColor = getSkillColor(task.skill);
    const completionLabel = task.completed ? 'Concluída' : 'Pendente';
    const completionTone = task.completed ? '#22c55e' : '#facc15';
    const userCount = task.usersCompleted ?? 181;
    const rating = task.rating ?? 4.9;
    const completionRate = task.completionRate ?? 76;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.heroCard, { backgroundColor: getSkillColorWithAlpha(task.skill, 0.18), borderColor: skillColor }]}>
                    <Text style={styles.heroLabel}>Missão em destaque</Text>
                    <Text style={styles.heroTitle}>{task.title}</Text>
                    <Text style={[styles.heroSkill, { color: skillColor }]}>Habilidade: {task.skill}</Text>

                    <View style={styles.heroMetaRow}>
                        <Text style={styles.heroMetaPill}>Dificuldade {task.difficulty || 2}/5</Text>
                        <Text style={[styles.heroStatus, { color: completionTone }]}>{completionLabel}</Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{userCount}</Text>
                        <Text style={styles.statLabel}>usuários já completaram</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{rating.toFixed(1)}★</Text>
                        <Text style={styles.statLabel}>nota média</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{completionRate}%</Text>
                        <Text style={styles.statLabel}>taxa de conclusão</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Descrição da missão</Text>
                    <Text style={styles.sectionText}>
                        Esta tarefa foi pensada para estimular a prática da habilidade <Text style={{ color: skillColor, fontWeight: '700' }}>{task.skill}</Text> em situações reais. Ela combina foco, repetição e feedback social para acelerar o crescimento.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>O que acontece aqui</Text>
                    <View style={styles.featureList}>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureBullet}>•</Text>
                            <Text style={styles.featureText}>Tempo estimado: 10 a 15 minutos</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureBullet}>•</Text>
                            <Text style={styles.featureText}>Recompensa mental: foco, confiança e prática contínua</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureBullet}>•</Text>
                            <Text style={styles.featureText}>Impacto social: pessoas próximas e comunidade ativa</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Comentários da comunidade</Text>
                    {defaultComments.map((item, index) => (
                        <View key={`${item.author}-${index}`} style={styles.commentCard}>
                            <View style={styles.commentHeaderRow}>
                                <Text style={styles.commentAuthor}>{item.author}</Text>
                                <Text style={styles.commentRole}>{item.role}</Text>
                            </View>
                            <Text style={styles.commentText}>{item.comment}</Text>
                        </View>
                    ))}
                </View>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: task.completed ? palette.surface : skillColor }]}
                    onPress={() => onToggleTask(task.id)}
                >
                    <Text style={styles.actionButtonText}>
                        {task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

const createStyles = (palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.background,
    },
    emptyText: {
        color: palette.textSecondary,
        fontSize: 16,
    },
    heroCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        marginBottom: 16,
    },
    heroLabel: {
        color: palette.textSecondary,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    heroTitle: {
        color: palette.textPrimary,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroSkill: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    heroMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    heroMetaPill: {
        color: palette.textPrimary,
        backgroundColor: palette.surface,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: '700',
    },
    heroStatus: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: palette.surface,
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: palette.border,
    },
    statValue: {
        color: palette.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: palette.textSecondary,
        fontSize: 11,
    },
    sectionCard: {
        backgroundColor: palette.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: palette.border,
        marginBottom: 16,
    },
    sectionTitle: {
        color: palette.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionText: {
        color: palette.textSecondary,
        lineHeight: 20,
    },
    featureList: {
        gap: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    featureBullet: {
        color: palette.accent,
        marginRight: 8,
        fontSize: 16,
        lineHeight: 18,
    },
    featureText: {
        color: palette.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    commentCard: {
        backgroundColor: palette.surfaceSoft,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: palette.border,
    },
    commentHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    commentAuthor: {
        color: palette.textPrimary,
        fontWeight: '700',
    },
    commentRole: {
        color: palette.textSecondary,
        fontSize: 11,
    },
    commentText: {
        color: palette.textSecondary,
        lineHeight: 18,
    },
    actionButton: {
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    actionButtonText: {
        color: palette.background,
        fontWeight: 'bold',
        fontSize: 15,
    },
});