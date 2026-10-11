import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppTopBar from './src/components/AppTopBar';
import AppMainContent from './src/components/AppMainContent';
import BottomNav from './src/components/BottomNav';
import { skills as initialSkills } from './src/models/skills';
import { tasks as initialTasks } from './src/models/tasks';
import { getPalette } from './src/theme/palette';
import { ThemeProvider } from './src/theme/themeContext';
import { clearPendingTaskMutation, enqueuePendingTaskMutation, getAppState, getPendingTaskMutations, saveAppState } from './src/storage/taskStorage';
import { toggleTask } from './src/services/taskService';
import { updateSkillsXP } from './src/services/xpService';
import { updateStreak } from './src/services/streakService';
import { getTodayDate, isYesterday } from './src/services/dateService';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import { getCloudProgress, mergeCloudProgress, setCloudTaskCompletion } from './src/services/progressRepository';

const mergeById = (defaults, saved = []) => defaults.map((item) => ({
    ...item,
    ...(saved.find((savedItem) => savedItem.id === item.id) || {}),
}));

function NovaVozApp() {
    const { user, loading: authLoading, isDemo } = useAuth();
    const [themeName, setThemeName] = useState('light');
    const [currentView, setCurrentView] = useState('home');
    const [selectedTask, setSelectedTask] = useState(null);
    const [skills, setSkills] = useState(initialSkills);
    const [tasks, setTasks] = useState(initialTasks);
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lastCompletedDate, setLastCompletedDate] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle');
    const feedbackOpacity = useRef(new Animated.Value(0)).current;
    const detailSlideOffset = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const palette = getPalette(themeName);
    const styles = createStyles(palette);

    useEffect(() => {
        if (!user) return undefined;
        let active = true;

        async function hydrate() {
            setHydrated(false);
            const saved = await getAppState(user.id);

            if (saved && active) {
                setTasks(mergeById(initialTasks, saved.tasks));
                setSkills(mergeById(initialSkills, saved.skills));
                setXP(Number(saved.xp) || 0);
                setThemeName(saved.themeName === 'dark' ? 'dark' : 'light');
                setLastCompletedDate(saved.lastCompletedDate || null);

                const streakIsActive = saved.lastCompletedDate === getTodayDate()
                    || isYesterday(saved.lastCompletedDate);
                setStreak(streakIsActive ? Number(saved.streak) || 0 : 0);
            }

            if (!isDemo) {
                try {
                    setSyncStatus('syncing');
                    const pendingMutations = await getPendingTaskMutations(user.id);
                    for (const mutation of pendingMutations) {
                        const task = initialTasks.find((item) => String(item.id) === String(mutation.taskId));
                        if (task) await setCloudTaskCompletion(task, mutation.completed);
                        await clearPendingTaskMutation(user.id, mutation.taskId);
                    }
                    const cloud = mergeCloudProgress(initialTasks, initialSkills, await getCloudProgress());
                    if (cloud && active) {
                        setTasks(cloud.tasks);
                        setSkills(cloud.skills);
                        setXP(cloud.xp);
                        setStreak(cloud.streak);
                        setLastCompletedDate(cloud.lastCompletedDate);
                        setSyncStatus('synced');
                    }
                } catch (error) {
                    console.warn('Não foi possível sincronizar o progresso.', error);
                    if (active) setSyncStatus('offline');
                }
            }

            if (active) setHydrated(true);
        }

        hydrate();
        return () => { active = false; };
    }, [isDemo, user?.id]);

    useEffect(() => {
        if (!hydrated) return;
        saveAppState({ tasks, skills, xp, streak, lastCompletedDate, themeName }, user?.id);
    }, [hydrated, tasks, skills, xp, streak, lastCompletedDate, themeName, user?.id]);

    useEffect(() => {
        if (currentView !== 'task-detail') return;
        detailSlideOffset.setValue(Dimensions.get('window').width);
        Animated.timing(detailSlideOffset, { toValue: 0, duration: 260, useNativeDriver: true }).start();
    }, [currentView, detailSlideOffset]);

    useEffect(() => {
        if (!feedback) return undefined;

        Animated.sequence([
            Animated.timing(feedbackOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.delay(1800),
            Animated.timing(feedbackOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(({ finished }) => finished && setFeedback(null));

        return () => feedbackOpacity.stopAnimation();
    }, [feedback, feedbackOpacity]);

    const handleSelectView = (nextView) => {
        setCurrentView(nextView);
        setSelectedTask(null);
    };

    const handleOpenTaskDetail = (task) => {
        setSelectedTask(task);
        setCurrentView('task-detail');
    };

    const handleBackFromDetail = () => {
        setCurrentView('home');
        setSelectedTask(null);
    };

    const handleToggleTask = async (taskId) => {
        const result = toggleTask({ tasks, taskId, streak });
        if (!result.selectedTask) return;

        setTasks(result.updatedTasks);
        setSelectedTask((current) => current?.id === taskId
            ? result.updatedTasks.find((task) => task.id === taskId)
            : current);

        if (result.earnedXP > 0) {
            setXP((currentXP) => currentXP + result.earnedXP);
            setSkills((currentSkills) => updateSkillsXP(currentSkills, result.selectedTask, result.earnedXP));

            const streakResult = updateStreak({ streak, lastCompletedDate });
            setStreak(streakResult.newStreak);
            setLastCompletedDate(streakResult.newLastCompletedDate);
            setFeedback({ xp: result.earnedXP, title: result.selectedTask.title });
        }

        if (!isDemo) {
            try {
                setSyncStatus('syncing');
                await setCloudTaskCompletion(result.selectedTask, !result.selectedTask.completed);
                await clearPendingTaskMutation(user.id, taskId);
                const cloud = mergeCloudProgress(initialTasks, initialSkills, await getCloudProgress());
                if (cloud) {
                    setTasks(cloud.tasks);
                    setSkills(cloud.skills);
                    setXP(cloud.xp);
                    setStreak(cloud.streak);
                    setLastCompletedDate(cloud.lastCompletedDate);
                }
                setSyncStatus('synced');
            } catch (error) {
                console.warn('A alteração ficou salva localmente e será sincronizada depois.', error);
                await enqueuePendingTaskMutation(user.id, {
                    taskId,
                    completed: !result.selectedTask.completed,
                    createdAt: new Date().toISOString(),
                });
                setSyncStatus('offline');
            }
        }
    };

    const isDetail = currentView === 'task-detail';
    const activeTitle = isDetail ? 'Missão' : currentView === 'viewer' ? 'Sua evolução' : currentView === 'profile' ? 'Seu perfil' : 'NovaVoz';

    if (authLoading) {
        return <View style={styles.loading}><ActivityIndicator size="large" color={palette.accent} /><Text style={styles.loadingText}>Preparando sua jornada…</Text></View>;
    }

    if (!user) return <AuthScreen palette={palette} />;

    return (
        <ThemeProvider themeName={themeName} toggleTheme={() => setThemeName((value) => value === 'dark' ? 'light' : 'dark')}>
            <View style={styles.appShell}>
                <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
                <View style={styles.topSpacer} />
                <AppTopBar palette={palette} themeName={themeName} currentView={currentView}
                    activeTitle={activeTitle} xp={xp} streak={streak} onBackPress={handleBackFromDetail}
                    onToggleTheme={() => setThemeName((value) => value === 'dark' ? 'light' : 'dark')} />

                <View style={styles.screenContainer}>
                    <AppMainContent currentView={currentView} skills={skills} tasks={tasks} selectedTask={selectedTask}
                        detailSlideOffset={detailSlideOffset} onTaskPress={handleOpenTaskDetail}
                        onToggleTask={handleToggleTask} screenContainerStyle={styles.screenContainer} xp={xp} streak={streak}
                        themeName={themeName} syncStatus={syncStatus}
                        onToggleTheme={() => setThemeName((value) => value === 'dark' ? 'light' : 'dark')} />
                </View>

                {!isDetail && <BottomNav activeItem={currentView} onSelect={handleSelectView} />}

                {feedback && (
                    <Animated.View accessibilityLiveRegion="polite" style={[styles.feedback, { opacity: feedbackOpacity }]}>
                        <Text style={styles.feedbackIcon}>✓</Text>
                        <View>
                            <Text style={styles.feedbackTitle}>Missão concluída!</Text>
                            <Text style={styles.feedbackText}>+{feedback.xp} XP conquistados</Text>
                        </View>
                    </Animated.View>
                )}

                {syncStatus === 'offline' && <View style={styles.offlineBadge}><Text style={styles.offlineText}>Modo offline · salvo neste aparelho</Text></View>}
            </View>
        </ThemeProvider>
    );
}

export default function App() {
    return <AuthProvider><NovaVozApp /></AuthProvider>;
}

const createStyles = (palette) => StyleSheet.create({
    appShell: { flex: 1, backgroundColor: palette.background },
    topSpacer: { height: 24, backgroundColor: palette.surface },
    screenContainer: { flex: 1 },
    feedback: { position: 'absolute', left: 20, right: 20, bottom: 92, backgroundColor: palette.surface,
        borderRadius: 18, borderWidth: 2, borderColor: palette.success, borderBottomWidth: 5,
        flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    feedbackIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.success,
        color: '#FFFFFF', textAlign: 'center', lineHeight: 38, fontSize: 22, fontWeight: '900' },
    feedbackTitle: { color: palette.textPrimary, fontWeight: '900', fontSize: 15 },
    feedbackText: { color: palette.success, fontWeight: '800', marginTop: 2 },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background },
    loadingText: { color: palette.textSecondary, fontWeight: '700', marginTop: 12 },
    offlineBadge: { position: 'absolute', top: 28, alignSelf: 'center', backgroundColor: '#FFF5CC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
    offlineText: { color: '#765B00', fontSize: 9, fontWeight: '900' },
});
