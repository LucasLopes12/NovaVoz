import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SkillsRadar } from '../components/SkillsRadar';
import { getSkillColor } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

export default function SkillsViewerScreen({ skills }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> Sua evolução </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>Radar de habilidades</Text>

                <View style={styles.radarCard}>
                    <SkillsRadar skills={skills} />
                </View>

                <View style={styles.skillsList}>
                    {skills.map((skill) => {
                        const skillColor = getSkillColor(skill.name);

                        return (
                            <View
                                key={skill.id}
                                style={[
                                    styles.skillRow,
                                    {
                                        backgroundColor: skillColor,
                                        borderColor: skillColor,
                                    },
                                ]}
                            >
                                <Text style={styles.skillName}>{skill.name}</Text>
                                <Text style={styles.skillProgress}>{skill.progress || 0}%</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: palette.textPrimary,
    },
    content: {
        alignItems: 'center',
        paddingBottom: 24,
        paddingTop: 12,
    },
    subtitle: {
        color: palette.textSecondary,
        fontSize: 16,
        marginBottom: 16,
    },
    radarCard: {
        width: '98%',
        height: '48%',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderRadius: 24,
        paddingTop: 18,
        paddingBottom: 18,
        paddingHorizontal: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: palette.border,
    },
    skillsList: {
        width: '100%',
        paddingHorizontal: 20,
    },
    skillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    skillName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff8f5',
    },
    skillProgress: {
        fontWeight: 'bold',
        color: '#fff8f5',
    },
});