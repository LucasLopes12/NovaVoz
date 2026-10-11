import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SkillsRadar } from '../components/SkillsRadar';
import { getSkillColor } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

export default function SkillsViewerScreen({ skills }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const strongest = [...skills].sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>SEU PERFIL</Text>
            <Text style={styles.title}>Cada conversa conta</Text>
            <Text style={styles.subtitle}>Complete missões para fortalecer suas habilidades sociais.</Text>

            <View style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>🏆</Text>
                <View style={styles.highlightCopy}>
                    <Text style={styles.highlightLabel}>PONTO FORTE</Text>
                    <Text style={styles.highlightTitle}>{strongest?.name || 'Comece sua trilha'}</Text>
                </View>
                <Text style={styles.highlightValue}>{strongest?.progress || 0}%</Text>
            </View>

            <View style={styles.radarCard}>
                <Text style={styles.cardTitle}>Mapa de habilidades</Text>
                <SkillsRadar skills={skills} />
            </View>

            <Text style={styles.sectionTitle}>Suas habilidades</Text>
            {skills.map((skill) => {
                const color = getSkillColor(skill.name);
                return (
                    <View key={skill.id} style={styles.skillCard}>
                        <View style={[styles.skillIcon, { backgroundColor: color }]}><Text style={styles.skillIconText}>◆</Text></View>
                        <View style={styles.skillCopy}>
                            <View style={styles.skillHeader}>
                                <Text style={styles.skillName}>{skill.name}</Text>
                                <Text style={[styles.skillProgress, { color }]}>{skill.progress || 0}%</Text>
                            </View>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.min(100, skill.progress || 0)}%` }]} />
                            </View>
                            <Text style={styles.skillLevel}>Nível {skill.level || 1} · {skill.xp || 0} XP</Text>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const createStyles = (palette) => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 18, paddingBottom: 32 },
    eyebrow: { color: palette.info, fontSize: 11, letterSpacing: 1.2, fontWeight: '900' },
    title: { color: palette.textPrimary, fontSize: 25, fontWeight: '900', marginTop: 5 },
    subtitle: { color: palette.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
    highlightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.warning, borderRadius: 18,
        padding: 15, borderBottomWidth: 5, borderBottomColor: '#D9A800', marginBottom: 16 },
    highlightIcon: { fontSize: 30, marginRight: 12 }, highlightCopy: { flex: 1 },
    highlightLabel: { color: '#765B00', fontSize: 9, letterSpacing: 1, fontWeight: '900' },
    highlightTitle: { color: '#4B3A00', fontSize: 17, fontWeight: '900', marginTop: 2 },
    highlightValue: { color: '#4B3A00', fontSize: 22, fontWeight: '900' },
    radarCard: { backgroundColor: palette.surface, borderRadius: 18, borderWidth: 2, borderColor: palette.border,
        borderBottomWidth: 5, borderBottomColor: palette.shadow, paddingTop: 16, overflow: 'hidden' },
    cardTitle: { color: palette.textPrimary, fontSize: 16, fontWeight: '900', marginHorizontal: 16 },
    sectionTitle: { color: palette.textPrimary, fontSize: 19, fontWeight: '900', marginTop: 24, marginBottom: 12 },
    skillCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16,
        borderWidth: 2, borderColor: palette.border, padding: 13, marginBottom: 10 },
    skillIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    skillIconText: { color: '#FFFFFF', fontSize: 17 }, skillCopy: { flex: 1 },
    skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
    skillName: { color: palette.textPrimary, fontSize: 14, fontWeight: '800' },
    skillProgress: { fontSize: 13, fontWeight: '900' },
    progressTrack: { height: 10, borderRadius: 5, backgroundColor: palette.surfaceSoft, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 5 },
    skillLevel: { color: palette.textSecondary, fontSize: 10, fontWeight: '700', marginTop: 6 },
});
