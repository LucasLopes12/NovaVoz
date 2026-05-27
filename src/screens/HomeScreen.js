import { View, StyleSheet, ScrollView } from 'react-native';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';
import { getSkillColor } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

export default function HomeScreen({ tasks, onTaskPress, onToggleTask }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const completedTasksNumber = tasks.filter((task) => task.completed).length;
    const completedTasksPorcentage = (tasks.length > 0 ? Number((completedTasksNumber * 100 / tasks.length).toFixed(0)) : 0);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        title={task.title}
                        skill={task.skill}
                        difficulty={task.difficulty}
                        completed={task.completed}
                        skillColor={getSkillColor(task.skill)}
                        onPress={() => onTaskPress(task)}
                        onToggleTask={() => onToggleTask(task.id)}
                    />
                ))}
            </ScrollView>

            <Footer
                concludedTasks={completedTasksNumber}
                numberTasks={tasks.length}
                concludedTasksPorcentage={completedTasksPorcentage}
            />
        </View>
    );
};

const createStyles = (palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        alignItems: 'center',
        paddingBottom: 140,
        paddingTop: 20,
    },
});