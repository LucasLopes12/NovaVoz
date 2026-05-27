export function calculateSkillProgress(xp) {
    return xp % 100;
}

export function calculateLevelXP(xp) {
    return Math.floor(xp / 100) + 1;
}

export function calculateTaskXP(task) {
    return task.difficulty * 10;
};

export function calculateStreakBonus(streak) {
    if (streak >= 15) {
        return 1.2;
    };

    if (streak >= 5) {
        return 1.1
    };

    return 1;
};

export function updateSkillsXP(
    skills,
    task, 
    earnedXP,
) {
    return skills.map((skill) => {
        if (skill.name === task.skill) {
            const newXP = skill.xp + earnedXP;
            const progress = calculateSkillProgress(newXP);

            return {
                ...skill,
                xp: newXP,
                level:calculateLevelXP(newXP),
                progress: progress
            };
        };
        return skill;
    });
};
