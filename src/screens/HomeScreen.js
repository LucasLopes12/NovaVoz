import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';
import { saveTasks, getTasks } from '../storage/taskStorage';

export default function HomeScreen() {
    const [tasks, setTasks] = useState(initialTasks);

    const completedTasksNumber = tasks.filter((tasks) => {
        return tasks.completed;
    }).length;

    const completedTasksPorcentage = (tasks.length > 0 ? Number((completedTasksNumber * 100 / tasks.length).toFixed(0)) : 0);

    const handleToggleTask = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            };

            return task;
        });

        setTasks(updatedTasks);
    };

    useEffect(() => {
        async function loadTasks() {
            const savedTasks = await getTasks();

            if (savedTasks.length > 0) {
                setTasks(savedTasks);
            }
        }

        loadTasks();
    }, []);

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    return (
        <View style={styles.container}>
            {tasks.map((task) => (
                <TaskCard
                key={task.id}
                title={task.title}
                skill={task.skill}
                completed={task.completed}
                onToggle={() => handleToggleTask(task.id)}
                >
                </TaskCard>

            ))}
            <Footer
                concludedTasks={completedTasksNumber}
                numberTasks={3}
                concludedTasksPorcentage={completedTasksPorcentage}
            ></Footer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

const initialTasks = [
    {
        id: 1,
        title: 'Dê bom dia a alguém na rua',
        skill: 'Extroversão',
        completed: false,
    },
    {
        id: 2,
        title: 'Peça informação para alguém desconhecido',
        skill: 'Comunicação',
        completed: false,
    },
    {
        id: 3,
        title: 'Grave um áudio de 1 minuto',
        skill: 'Oratória',
        completed: false,
    },
];