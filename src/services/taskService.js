import { calculateTaskXP, calculateStreakBonus } from "./xpService";

export function toggleTask({
    tasks,
    taskId,
    streak,
}) {
    let earnedXP = 0;
    const selectedTask = tasks.find((task) => task.id === taskId);

    const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
            const shouldComplete = !task.completed;
            const shouldEarnXP = shouldComplete && !task.alreadyEarnedXP;

            if (shouldEarnXP) {
                const streakBonus = calculateStreakBonus(streak);

                earnedXP = calculateTaskXP(task) * streakBonus;
            }
            return {
                ...task,
                completed: shouldComplete,
                alreadyEarnedXP: task.alreadyEarnedXP || shouldEarnXP,
            };
        };

        return task;
    });
    
    return {
        updatedTasks,
        earnedXP,
        selectedTask,
    };
};
