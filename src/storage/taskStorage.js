import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@tasks';

export async function saveTasks(tasks) {
    try {
        const tasksJSON = JSON.stringify(tasks);

        await AsyncStorage.setItem(
            TASKS_KEY,
            tasksJSON
        );
    } catch (error) {
        console.log(error);
    };
};

export async function getTasks() {
    try {
        const tasksJSON = await AsyncStorage.getItem(
            TASKS_KEY
        );

        if (tasksJSON) {
            return JSON.parse(tasksJSON);
        }

        return [];
    } catch (error) {
        console.log(error);
    };
    
    return [];
};