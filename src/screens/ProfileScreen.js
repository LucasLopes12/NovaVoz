import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useThemePalette } from '../theme/themeContext';

const initialsFrom = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'N';

export default function ProfileScreen({ xp, streak, completedCount, themeName, syncStatus, onToggleTheme }) {
    const { palette } = useThemePalette();
    const { user, isDemo, signOut } = useAuth();
    const styles = createStyles(palette);
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Estudante';
    const level = Math.floor(xp / 100) + 1;
    const syncLabel = syncStatus === 'syncing'
        ? '● SINCRONIZANDO…'
        : syncStatus === 'offline' ? '● OFFLINE · ALTERAÇÕES NA FILA' : '● SINCRONIZADO NA NUVEM';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{initialsFrom(name)}</Text></View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={[styles.syncBadge, isDemo ? styles.demoBadge : styles.cloudBadge]}>
                    <Text style={[styles.syncText, isDemo ? styles.demoText : styles.cloudText]}>{isDemo ? '● PROGRESSO NESTE APARELHO' : syncLabel}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Suas conquistas</Text>
            <View style={styles.statsRow}>
                <View style={styles.statCard}><Text style={styles.statIcon}>⚡</Text><Text style={styles.statValue}>{xp}</Text><Text style={styles.statLabel}>XP TOTAL</Text></View>
                <View style={styles.statCard}><Text style={styles.statIcon}>🔥</Text><Text style={styles.statValue}>{streak}</Text><Text style={styles.statLabel}>SEQUÊNCIA</Text></View>
                <View style={styles.statCard}><Text style={styles.statIcon}>✓</Text><Text style={styles.statValue}>{completedCount}</Text><Text style={styles.statLabel}>MISSÕES</Text></View>
            </View>

            <View style={styles.levelCard}>
                <View style={styles.levelBadge}><Text style={styles.levelNumber}>{level}</Text></View>
                <View style={styles.levelCopy}><Text style={styles.levelTitle}>Nível {level}</Text><Text style={styles.levelText}>{100 - (xp % 100)} XP para o próximo nível</Text>
                    <View style={styles.track}><View style={[styles.fill, { width: `${xp % 100}%` }]} /></View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Preferências</Text>
            <Pressable onPress={onToggleTheme} style={styles.settingRow}>
                <View style={styles.settingIcon}><Text style={styles.settingEmoji}>{themeName === 'dark' ? '☀️' : '🌙'}</Text></View>
                <View style={styles.settingCopy}><Text style={styles.settingTitle}>Aparência</Text><Text style={styles.settingSubtitle}>Tema {themeName === 'dark' ? 'escuro' : 'claro'}</Text></View>
                <Text style={styles.chevron}>›</Text>
            </Pressable>

            <Pressable onPress={signOut} style={styles.signOutButton}><Text style={styles.signOutText}>SAIR DA CONTA</Text></Pressable>
            <Text style={styles.version}>NovaVoz · versão 1.0</Text>
        </ScrollView>
    );
}

const createStyles = (palette) => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 18, paddingBottom: 32 },
    profileCard: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: 22, borderWidth: 2, borderColor: palette.border, borderBottomWidth: 6, borderBottomColor: palette.shadow, padding: 22 },
    avatar: { width: 76, height: 76, borderRadius: 24, backgroundColor: palette.info, borderBottomWidth: 6, borderBottomColor: '#168ECB', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#FFFFFF', fontSize: 27, fontWeight: '900' }, name: { color: palette.textPrimary, fontSize: 22, fontWeight: '900', marginTop: 13 },
    email: { color: palette.textSecondary, fontSize: 13, marginTop: 3 }, syncBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginTop: 12 },
    cloudBadge: { backgroundColor: palette.accentSoft }, demoBadge: { backgroundColor: '#FFF5CC' }, syncText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.4 }, cloudText: { color: palette.accentStrong }, demoText: { color: '#8B6A00' },
    sectionTitle: { color: palette.textPrimary, fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 11 },
    statsRow: { flexDirection: 'row', gap: 8 }, statCard: { flex: 1, alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, borderWidth: 2, borderColor: palette.border, paddingVertical: 14 },
    statIcon: { fontSize: 20 }, statValue: { color: palette.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 4 }, statLabel: { color: palette.textSecondary, fontSize: 8, fontWeight: '900', marginTop: 3 },
    levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 17, borderWidth: 2, borderColor: palette.border, padding: 14, marginTop: 10 },
    levelBadge: { width: 48, height: 48, borderRadius: 15, backgroundColor: palette.warning, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, levelNumber: { color: '#624B00', fontSize: 22, fontWeight: '900' },
    levelCopy: { flex: 1 }, levelTitle: { color: palette.textPrimary, fontSize: 15, fontWeight: '900' }, levelText: { color: palette.textSecondary, fontSize: 10, marginTop: 2 },
    track: { height: 9, backgroundColor: palette.surfaceSoft, borderRadius: 5, overflow: 'hidden', marginTop: 8 }, fill: { height: '100%', backgroundColor: palette.warning, borderRadius: 5 },
    settingRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, borderWidth: 2, borderColor: palette.border, padding: 11 },
    settingIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surfaceSoft, marginRight: 11 }, settingEmoji: { fontSize: 20 },
    settingCopy: { flex: 1 }, settingTitle: { color: palette.textPrimary, fontSize: 14, fontWeight: '900' }, settingSubtitle: { color: palette.textSecondary, fontSize: 11, marginTop: 2 }, chevron: { color: palette.textSecondary, fontSize: 28 },
    signOutButton: { height: 50, borderRadius: 14, borderWidth: 2, borderBottomWidth: 5, borderColor: palette.danger, alignItems: 'center', justifyContent: 'center', marginTop: 24 }, signOutText: { color: palette.danger, fontSize: 12, fontWeight: '900' },
    version: { color: palette.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 15 },
});
