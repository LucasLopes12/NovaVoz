import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemePalette } from '../theme/themeContext';

const items = [
    { key: 'home', icon: '⌂', label: 'Trilha' },
    { key: 'viewer', icon: '◆', label: 'Evolução' },
    { key: 'profile', icon: '●', label: 'Perfil' },
];

export default function BottomNav({ activeItem, onSelect }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);

    return (
        <View style={styles.container}>
            {items.map((item) => {
                const active = item.key === activeItem;
                return (
                    <Pressable key={item.key} accessibilityRole="tab" accessibilityState={{ selected: active }}
                        onPress={() => onSelect(item.key)} style={[styles.item, active && styles.activeItem]}>
                        <Text style={[styles.icon, active && styles.activeText]}>{item.icon}</Text>
                        <Text style={[styles.label, active && styles.activeText]}>{item.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: palette.surface, borderTopColor: palette.border,
        borderTopWidth: 2, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12, gap: 12 },
    item: { flex: 1, minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'transparent' },
    activeItem: { backgroundColor: palette.accentSoft, borderColor: palette.accent },
    icon: { color: palette.textSecondary, fontSize: 20, fontWeight: '900', lineHeight: 20 },
    label: { color: palette.textSecondary, fontSize: 11, fontWeight: '800', marginTop: 3, textTransform: 'uppercase' },
    activeText: { color: palette.accentStrong },
});
