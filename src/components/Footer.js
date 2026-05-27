import { View, StyleSheet, Text } from 'react-native';
import { useThemePalette } from '../theme/themeContext';

export default function Footer(props) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);

    return (
        <View style={styles.footer}>
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
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderTopColor: palette.border,
        alignItems: 'center',
    },
    footerText: {
        color: palette.textPrimary,
        fontWeight: '600',
    },
})