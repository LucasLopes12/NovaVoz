import { View, StyleSheet, Text } from 'react-native';
import { useThemePalette } from '../theme/themeContext';

export default function Footer(props) {
    const { palette, themeName } = useThemePalette();
    const footerColor = themeName === 'dark' ? palette.accentStrong : palette.accent;
    const styles = createStyles(palette, footerColor);

    return (
        <View style={[styles.footer, { backgroundColor: footerColor, borderTopColor: footerColor }]}>
            <Text style={styles.footerText}> {props.concludedTasks} de {props.numberTasks} missões concluídas.</Text>
            <Text style={styles.footerText}> {props.concludedTasksPorcentage}% concluído.</Text>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    footerText: {
        color: palette.textPrimary,
        fontWeight: '600',
    },
})