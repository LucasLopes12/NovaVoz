import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Image } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SkillsViewerScreen from './src/screens/SkillsViewerScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import DrawerMenu from './src/components/DrawerMenu';
import { skills as initialSkills } from './src/models/skills';
import { getPalette } from './src/theme/palette';
import { ThemeProvider } from './src/theme/themeContext';
import { getTasks, saveTasks } from './src/storage/taskStorage';
import { toggleTask } from './src/services/taskService';
import { updateSkillsXP } from './src/services/xpService';
import { updateStreak } from './src/services/streakService';

const menuItems = [
  { key: 'home', label: 'Home' },
  { key: 'viewer', label: 'Skills Viewer' },
];

const initialTasks = [
  {
    id: 1,
    title: 'Dê bom dia a alguém na rua',
    skill: 'Extroversão',
    completed: false,
    difficulty: 2,
    usersCompleted: 181,
    rating: 4.8,
    completionRate: 74,
  },
  {
    id: 2,
    title: 'Peça informação para alguém desconhecido',
    skill: 'Comunicação',
    completed: false,
    difficulty: 3,
    usersCompleted: 214,
    rating: 4.9,
    completionRate: 81,
  },
  {
    id: 3,
    title: 'Grave um áudio de 1 minuto',
    skill: 'Oratória',
    completed: false,
    difficulty: 4,
    usersCompleted: 163,
    rating: 4.7,
    completionRate: 69,
  },
  {
    id: 4,
    title: 'Encare um desconhecido e dê um sorriso',
    skill: 'Coragem',
    completed: false,
    difficulty: 2,
    usersCompleted: 192,
    rating: 4.6,
    completionRate: 71,
  },
  {
    id: 5,
    title: 'Apresente-se em 30 segundos para um colega',
    skill: 'Confiança',
    completed: false,
    difficulty: 3,
    usersCompleted: 176,
    rating: 4.8,
    completionRate: 77,
  },
  {
    id: 6,
    title: 'Faça um elogio sincero para alguém',
    skill: 'Empatia',
    completed: false,
    difficulty: 2,
    usersCompleted: 205,
    rating: 4.9,
    completionRate: 84,
  },
  {
    id: 7,
    title: 'Conte uma história curta em voz alta',
    skill: 'Oratória',
    completed: false,
    difficulty: 4,
    usersCompleted: 168,
    rating: 4.7,
    completionRate: 73,
  },
  {
    id: 8,
    title: 'Pergunte algo novo em um grupo',
    skill: 'Comunicação',
    completed: false,
    difficulty: 3,
    usersCompleted: 187,
    rating: 4.8,
    completionRate: 79,
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
        <View style={styles.topBar}>
          {currentView === 'task-detail' ? (
            <AnimatedPressable
              style={[styles.menuButton, { transform: [{ scale: menuButtonScale }] }]}
              onPressIn={() => animatePress(menuButtonScale, true)}
              onPressOut={() => animatePress(menuButtonScale, false)}
              onPress={handleBackFromDetail}
            >
              <Text style={styles.menuButtonText}>←</Text>
            </AnimatedPressable>
          ) : (
            <AnimatedPressable
              style={[styles.menuButton, { transform: [{ scale: menuButtonScale }] }]}
              onPressIn={() => animatePress(menuButtonScale, true)}
              onPressOut={() => animatePress(menuButtonScale, false)}
              onPress={() => setDrawerOpen((current) => !current)}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </AnimatedPressable>
          )}

          <Text style={styles.headerTitle}>{activeTitle}</Text>

          <AnimatedPressable
            style={styles.themeToggleButton}
            onPress={toggleTheme}
          >
            <Image
              source={themeName === 'dark' ? require('./assets/SUNPIXELART.png') : require('./assets/MOONPIXELART.png')}
              style={styles.themeToggleIcon}
              resizeMode="contain"
            />
          </AnimatedPressable>
        </View>

        <View style={styles.screenContainer}>
          {currentView === 'viewer' ? (
            <SkillsViewerScreen skills={skills} />
          ) : currentView === 'task-detail' ? (
            <TaskDetailScreen
              task={selectedTask}
              onToggleTask={handleToggleTask}
              onBack={handleBackFromDetail}
            />
          ) : (
            <HomeScreen
              tasks={tasks}
              onTaskPress={handleOpenTaskDetail}
              onToggleTask={handleToggleTask}
            />
          )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    marginRight: 12,
  },
  menuButtonText: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  themeToggleButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleIcon: {
    width: 35,
    height: 35,
  },
  screenContainer: {
    flex: 1,
  },
});