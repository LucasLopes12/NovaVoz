import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_STATE_KEY = '@novavoz/app-state/v3';
const PENDING_SYNC_KEY = '@novavoz/pending-sync/v1';
const PENDING_REFLECTION_KEY = '@novavoz/pending-reflections/v1';
const LEGACY_TASKS_KEY = '@tasks';

const getOwnerKey = (ownerId = 'guest') => `${APP_STATE_KEY}/${ownerId}`;
const getPendingKey = (ownerId) => `${PENDING_SYNC_KEY}/${ownerId}`;
const getPendingReflectionKey = (ownerId) => `${PENDING_REFLECTION_KEY}/${ownerId}`;

export async function saveAppState(appState, ownerId = 'guest') {
    try {
        await AsyncStorage.setItem(getOwnerKey(ownerId), JSON.stringify(appState));
    } catch (error) {
        console.warn('Não foi possível salvar o progresso do NovaVoz.', error);
    }
}

export async function getAppState(ownerId = 'guest') {
    try {
        const savedState = await AsyncStorage.getItem(getOwnerKey(ownerId));
        if (savedState) return JSON.parse(savedState);

        const previousState = await AsyncStorage.getItem('@novavoz/app-state/v2');
        if (previousState && ownerId === 'demo') return JSON.parse(previousState);

        const legacyTasks = await AsyncStorage.getItem(LEGACY_TASKS_KEY);
        return legacyTasks ? { tasks: JSON.parse(legacyTasks) } : null;
    } catch (error) {
        console.warn('Não foi possível carregar o progresso do NovaVoz.', error);
        return null;
    }
}

export async function enqueuePendingTaskMutation(ownerId, mutation) {
    try {
        const key = getPendingKey(ownerId);
        const current = JSON.parse(await AsyncStorage.getItem(key) || '[]');
        const withoutOlderIntent = current.filter((item) => String(item.taskId) !== String(mutation.taskId));
        await AsyncStorage.setItem(key, JSON.stringify([...withoutOlderIntent, mutation]));
    } catch (error) {
        console.warn('Não foi possível guardar a alteração para sincronizar depois.', error);
    }
}

export async function getPendingTaskMutations(ownerId) {
    try {
        return JSON.parse(await AsyncStorage.getItem(getPendingKey(ownerId)) || '[]');
    } catch (error) {
        console.warn('Não foi possível ler a fila de sincronização.', error);
        return [];
    }
}

export async function clearPendingTaskMutation(ownerId, taskId) {
    try {
        const key = getPendingKey(ownerId);
        const current = JSON.parse(await AsyncStorage.getItem(key) || '[]');
        const remaining = current.filter((item) => String(item.taskId) !== String(taskId));
        await AsyncStorage.setItem(key, JSON.stringify(remaining));
    } catch (error) {
        console.warn('Não foi possível atualizar a fila de sincronização.', error);
    }
}

export async function enqueuePendingReflection(ownerId, reflection) {
    try {
        const key = getPendingReflectionKey(ownerId);
        const current = JSON.parse(await AsyncStorage.getItem(key) || '[]');
        const withoutOlderReflection = current.filter((item) => String(item.taskId) !== String(reflection.taskId));
        await AsyncStorage.setItem(key, JSON.stringify([...withoutOlderReflection, reflection]));
    } catch (error) {
        console.warn('Não foi possível guardar a reflexão para sincronizar depois.', error);
    }
}

export async function getPendingReflections(ownerId) {
    try {
        return JSON.parse(await AsyncStorage.getItem(getPendingReflectionKey(ownerId)) || '[]');
    } catch (error) {
        console.warn('Não foi possível ler as reflexões pendentes.', error);
        return [];
    }
}

export async function clearPendingReflection(ownerId, taskId) {
    try {
        const key = getPendingReflectionKey(ownerId);
        const current = JSON.parse(await AsyncStorage.getItem(key) || '[]');
        const remaining = current.filter((item) => String(item.taskId) !== String(taskId));
        await AsyncStorage.setItem(key, JSON.stringify(remaining));
    } catch (error) {
        console.warn('Não foi possível atualizar as reflexões pendentes.', error);
    }
}
