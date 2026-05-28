import { Animated } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SkillsViewerScreen from '../screens/SkillsViewerScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

export default function AppMainContent({
    currentView,
    skills,
    tasks,
    selectedTask,
    detailSlideOffset,
    onTaskPress,
    onToggleTask,
    onBack,
    screenContainerStyle,
}) {
    if (currentView === 'viewer') {
        return <SkillsViewerScreen skills={skills} />;
    }

    if (currentView === 'task-detail') {
        return (
            <Animated.View
                style={[
                    screenContainerStyle,
                    {
                        transform: [{ translateX: detailSlideOffset }],
                    },
                ]}
            >
                <TaskDetailScreen
                    task={selectedTask}
                    onToggleTask={onToggleTask}
                    onBack={onBack}
                />
            </Animated.View>
        );
    }

    return (
        <HomeScreen
            tasks={tasks}
            onTaskPress={onTaskPress}
            onToggleTask={onToggleTask}
        />
    );
}
