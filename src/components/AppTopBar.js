import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppTopBar({ palette, themeName, currentView, activeTitle, xp, streak, onBackPress, onToggleTheme }) {
    const styles = createStyles(palette);
    const isDetail = currentView === 'task-detail';

    return (
        <View style={styles.topBar}>
            {isDetail ? (
                <Pressable accessibilityLabel="Voltar" onPress={onBackPress} style={styles.backButton}>
                    <Text style={styles.backText}>‹</Text>
                </Pressable>
            ) : (
                <View style={styles.brandMark}><Text style={styles.brandLetter}>N</Text></View>
            )}

            <Text numberOfLines={1} style={styles.headerTitle}>{activeTitle}</Text>

            {!isDetail && (
                <View style={styles.stats}>
                    <View style={styles.statPill}><Text style={styles.fire}>🔥</Text><Text style={styles.streak}>{streak}</Text></View>
                    <View style={styles.statPill}><Text style={styles.bolt}>⚡</Text><Text style={styles.xp}>{xp}</Text></View>
                </View>
            )}

            <Pressable accessibilityLabel={`Ativar tema ${themeName === 'dark' ? 'claro' : 'escuro'}`}
                style={styles.themeButton} onPress={onToggleTheme}>
                <Image source={themeName === 'dark' ? require('../../assets/SUNPIXELART.png') : require('../../assets/MOONPIXELART.png')}
                    style={styles.themeIcon} resizeMode="contain" />
            </Pressable>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    topBar: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
        paddingVertical: 10, backgroundColor: palette.surface, borderBottomWidth: 2, borderBottomColor: palette.border },
    brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.accent,
        alignItems: 'center', justifyContent: 'center', borderBottomWidth: 4, borderBottomColor: palette.accentStrong },
    brandLetter: { color: '#FFFFFF', fontWeight: '900', fontSize: 21 },
    backButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: palette.border, borderBottomWidth: 4, backgroundColor: palette.surface },
    backText: { color: palette.textSecondary, fontSize: 32, lineHeight: 31, fontWeight: '700' },
    headerTitle: { color: palette.textPrimary, fontSize: 19, fontWeight: '900', marginLeft: 10, flexShrink: 1 },
    stats: { flexDirection: 'row', marginLeft: 'auto', gap: 5 },
    statPill: { minWidth: 45, height: 34, paddingHorizontal: 7, borderRadius: 10, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surfaceSoft, gap: 2 },
    fire: { fontSize: 14 }, streak: { color: '#FF9600', fontWeight: '900', fontSize: 13 },
    bolt: { fontSize: 13 }, xp: { color: palette.info, fontWeight: '900', fontSize: 13 },
    themeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
    themeIcon: { width: 29, height: 29 },
});
