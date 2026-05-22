import { View, StyleSheet, Text } from 'react-native';

export default function Footer(props) {
    return (
        <View style={styles.footer}>
            <Text> {props.concludedTasks} de {props.numberTasks} missões concluídas.</Text>
            <Text> {props.concludedTasksPorcentage}% concluído.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#aa44ff'
    }
})