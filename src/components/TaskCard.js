import { View, Text, StyleSheet, Pressable } from "react-native";

export default function TaskCard(props) {

    return (
        <Pressable style={styles.card} onPress={props.onToggle}>
            <Text style={styles.title}> {props.title} </Text>

            <Text style={styles.skill}> Habilidade: {props.skill} </Text>

            <Text style={styles.status}> {props.completed ? 'Concluída' : 'Pendente'} </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#1e1e1e',
        marginBottom: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    skill: {
        color: '#cccccc',
        fontSize: 16,
    },
    status: {
        marginTop: 10,
        color: '#00ff88',
        fontWeight: 'bold'
    }
});