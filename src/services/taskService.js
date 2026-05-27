import { calculateTaskXP, calculateStreakBonus } from "./xpService";

export function toggleTask({
    tasks,
    taskId,
    streak,
}) {
    let earnedXP = 0;
    const selectedTask = tasks.find((task) => task.id === taskId)

    const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
            const shouldEarnXP = !task.alreadyEarnedXP;

            if (shouldEarnXP) {
                const streakBonus = calculateStreakBonus(streak);

                earnedXP = calculateTaskXP(task) * streakBonus;
            }
            return {
                ...task, 
                completed: !task.completed,
                alreadyEarnedXP: true
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