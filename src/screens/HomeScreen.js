import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';
import { saveTasks, getTasks } from '../storage/taskStorage';
import { calculateStreakBonus, calculateTaskXP, updateSkillsXP } from '../services/xpService';
import { getTodayDate, isYesterday } from '../services/dateService';
import { skills as initialSkills } from '../models/skills';
import { toggleTask } from '../services/taskService';
import { updateStreak } from '../services/streakService';
import { SkillsRadar } from '../components/SkillsRadar';

export default function HomeScreen() {
    const [tasks, setTasks] = useState(initialTasks);
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lastCompletedDate, setLastCompletedDate] = useState(null);
    const [skills, setSkills] = useState(initialSkills)

    const completedTasksNumber = tasks.filter((tasks) => {
        return tasks.completed;
    }).length;

    const completedTasksPorcentage = (tasks.length > 0 ? Number((completedTasksNumber * 100 / tasks.length).toFixed(0)) : 0);

    const handleToggleTask = (taskId) => {
        const {
            updatedTasks,
            earnedXP,
            selectedTask,
        } = toggleTask({
            tasks,
            taskId,
            streak
        });

        setTasks(updatedTasks);
        setXP((currentXP) => currentXP + earnedXP)
        setSkills((currentSkills) =>
            updateSkillsXP(
                currentSkills,
                selectedTask,
                earnedXP,
            )
        );

        if (earnedXP > 0) {
            const {
                newStreak,
                newLastCompletedDate
            } = updateStreak({
                streak,
                lastCompletedDate
            });

            setStreak(newStreak);
            setLastCompletedDate(newLastCompletedDate);
        }
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
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        title={task.title}
                        skill={task.skill}
                        completed={task.completed}
                        onToggle={() => handleToggleTask(task.id)}
                    />
                ))}

                <SkillsRadar skills={skills} />
            </ScrollView>

            <Footer
                concludedTasks={completedTasksNumber}
                numberTasks={3}
                concludedTasksPorcentage={completedTasksPorcentage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        paddingBottom: 140,
        paddingTop: 20,
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