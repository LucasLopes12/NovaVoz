import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import DrawerMenu from './src/components/DrawerMenu';
import AppTopBar from './src/components/AppTopBar';
import AppMainContent from './src/components/AppMainContent';
import { skills as initialSkills } from './src/models/skills';
import { tasks as initialTasks } from './src/models/tasks';
import { getPalette } from './src/theme/palette';
import { ThemeProvider } from './src/theme/themeContext';
import { getTasks, saveTasks } from './src/storage/taskStorage';
import { toggleTask } from './src/services/taskService';
import { updateSkillsXP } from './src/services/xpService';
import { updateStreak } from './src/services/streakService';

const menuItems = [
  { key: 'home', label: 'Home' },
  { key: 'viewer', label: 'Suas Jóias' },
];

const legacyDefaultTaskSeed = [
  {
    title: 'Dê bom dia a alguém na rua',
    skill: 'Extroversão',
    difficulty: 2,
  },
  {
    title: 'Peça informação para alguém desconhecido',
    skill: 'Oratória',
    difficulty: 3,
  },
  {
    title: 'Grave um áudio de 1 minuto',
    skill: 'Oratória',
    difficulty: 4,
  },
];

const isLegacyTaskSeed = (savedTasks) => {
  if (!Array.isArray(savedTasks) || savedTasks.length !== legacyDefaultTaskSeed.length) {
    return false;
  }

  return savedTasks.every((task, index) => {
    const legacyTask = legacyDefaultTaskSeed[index];

    return task.title === legacyTask.title
      && task.skill === legacyTask.skill
      && task.difficulty === legacyTask.difficulty;
  });
};

export default function App() {
  const [themeName, setThemeName] = useState('dark');
  const [currentView, setCurrentView] = useState('home');
  const [selectedTask, setSelectedTask] = useState(null);
  const [skills, setSkills] = useState(initialSkills);
  const [tasks, setTasks] = useState(initialTasks);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonScale = useRef(new Animated.Value(1)).current;
  const detailSlideOffset = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const palette = getPalette(themeName);

  const styles = createStyles(palette);

  const toggleTheme = () => {
    setThemeName((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  const animatePress = (animatedValue, shouldPress) => {
    Animated.spring(animatedValue, {
      toValue: shouldPress ? 0.96 : 1,
      speed: 24,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (currentView === 'task-detail') {
      detailSlideOffset.setValue(Dimensions.get('window').width);
      Animated.timing(detailSlideOffset, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [currentView, detailSlideOffset]);

  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await getTasks();

      if (isLegacyTaskSeed(savedTasks)) {
        setTasks(initialTasks);
        await saveTasks(initialTasks);
        return;
      }

      if (savedTasks.length > 0) {
        setTasks(savedTasks);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleSelectView = (nextView) => {
    setCurrentView(nextView);
    setSelectedTask(null);
    setDrawerOpen(false);
  };

  const handleOpenTaskDetail = (task) => {
    setSelectedTask(task);
    setCurrentView('task-detail');
    setDrawerOpen(false);
  };

  const handleBackFromDetail = () => {
    setCurrentView('home');
    setSelectedTask(null);
  };

  const handleToggleTask = (taskId) => {
    const {
      updatedTasks,
      earnedXP,
      selectedTask: toggledTask,
    } = toggleTask({
      tasks,
      taskId,
      streak,
    });

    setTasks(updatedTasks);
    setSelectedTask((currentTask) => currentTask && currentTask.id === taskId ? {
      ...currentTask,
      completed: !currentTask.completed,
    } : currentTask);
    setXP((currentXP) => currentXP + earnedXP);
    setSkills((currentSkills) =>
      updateSkillsXP(
        currentSkills,
        toggledTask,
        earnedXP,
      )
    );

    if (earnedXP > 0) {
      const {
        newStreak,
        newLastCompletedDate,
      } = updateStreak({
        streak,
        lastCompletedDate,
      });

      setStreak(newStreak);
      setLastCompletedDate(newLastCompletedDate);
    }
  };

  const activeTitle = currentView === 'task-detail'
    ? (selectedTask?.title || 'Detalhe da tarefa')
    : menuItems.find((item) => item.key === currentView)?.label || 'NovaVoz';

  return (
    <ThemeProvider themeName={themeName} toggleTheme={toggleTheme}>
      <View style={styles.appShell}>
        <View style={[styles.topSpacer, { backgroundColor: palette.background }]} />

        <AppTopBar
          palette={palette}
          themeName={themeName}
          currentView={currentView}
          activeTitle={activeTitle}
          menuButtonScale={menuButtonScale}
          onButtonPressIn={() => animatePress(menuButtonScale, true)}
          onButtonPressOut={() => animatePress(menuButtonScale, false)}
          onMenuPress={() => setDrawerOpen((current) => !current)}
          onBackPress={handleBackFromDetail}
          onToggleTheme={toggleTheme}
        />

        <View style={styles.screenContainer}>
          <AppMainContent
            currentView={currentView}
            skills={skills}
            tasks={tasks}
            selectedTask={selectedTask}
            detailSlideOffset={detailSlideOffset}
            onTaskPress={handleOpenTaskDetail}
            onToggleTask={handleToggleTask}
            onBack={handleBackFromDetail}
            screenContainerStyle={styles.screenContainer}
          />
        </View>

        <DrawerMenu
          items={menuItems}
          activeItem={currentView}
          onSelect={handleSelectView}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        />
      </View>
    </ThemeProvider>
  );
};

const createStyles = (palette) => StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: palette.background,
  },
  topSpacer: {
    height: 24,
  },
  screenContainer: {
    flex: 1,
  },
});