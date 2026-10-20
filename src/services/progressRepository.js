import { supabase } from '../lib/supabase';

export async function getCloudProgress() {
    if (!supabase) return null;

    const [profileResult, tasksResult, skillsResult] = await Promise.all([
        supabase.from('profiles').select('xp, streak, last_completed_date').single(),
        supabase.from('task_progress').select('*'),
        supabase.from('skill_progress').select('skill_name, xp'),
    ]);

    const error = profileResult.error || tasksResult.error || skillsResult.error;
    if (error) throw error;

    return {
        xp: profileResult.data?.xp || 0,
        streak: profileResult.data?.streak || 0,
        lastCompletedDate: profileResult.data?.last_completed_date || null,
        tasks: tasksResult.data || [],
        skills: skillsResult.data || [],
    };
}

export async function setCloudTaskCompletion(task, completed) {
    if (!supabase) return null;

    const { data, error } = await supabase.rpc('set_task_completion', {
        p_task_id: String(task.id),
        p_completed: completed,
    });

    if (error) throw error;
    return data;
}

export async function setCloudTaskReflection(taskId, reflection) {
    if (!supabase) return null;

    const { data, error } = await supabase.rpc('set_task_reflection', {
        p_task_id: String(taskId),
        p_reflection: reflection.trim() || null,
    });

    if (error) throw error;
    return data;
}

export function mergeCloudProgress(defaultTasks, defaultSkills, cloud) {
    if (!cloud) return null;
    const taskById = new Map(cloud.tasks.map((item) => [String(item.task_id), item]));
    const skillByName = new Map(cloud.skills.map((item) => [item.skill_name, item]));

    return {
        tasks: defaultTasks.map((task) => {
            const saved = taskById.get(String(task.id));
            return saved ? {
                ...task,
                completed: saved.completed,
                alreadyEarnedXP: saved.xp_awarded,
                reflection: saved.reflection || '',
            } : task;
        }),
        skills: defaultSkills.map((skill) => {
            const saved = skillByName.get(skill.name);
            if (!saved) return skill;
            const xp = Number(saved.xp) || 0;
            return { ...skill, xp, level: Math.floor(xp / 100) + 1, progress: xp % 100 };
        }),
        xp: Number(cloud.xp) || 0,
        streak: Number(cloud.streak) || 0,
        lastCompletedDate: cloud.lastCompletedDate || null,
    };
}
