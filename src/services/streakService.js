import {
    getTodayDate,
    isYesterday
} from './dateService';

export function updateStreak({
    streak,
    lastCompletedDate
}) {
    const today = getTodayDate();

    if (!lastCompletedDate) {
        return {
            newStreak: 1,
            newLastCompletedDate: today,
        };
    };

    if (lastCompletedDate === today) {
        return {
            newStreak: streak,
            newLastCompletedDate: today,
        };
    };

    if (isYesterday(lastCompletedDate)) {
        return {
            newStreak: streak + 1,
            newLastCompletedDate: today,
        };
    };

    return {
        newStreak: 1,
        newLastCompletedDate: today,
    };
}