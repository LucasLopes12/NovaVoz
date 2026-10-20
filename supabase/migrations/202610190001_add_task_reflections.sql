-- Permite que cada usuário registre uma reflexão opcional depois de concluir uma missão.

alter table public.task_progress
add column if not exists reflection text;

alter table public.task_progress
drop constraint if exists task_progress_reflection_length;

alter table public.task_progress
add constraint task_progress_reflection_length
check (reflection is null or char_length(reflection) <= 600);

create or replace function public.set_task_reflection(
    p_task_id text,
    p_reflection text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_reflection text := nullif(btrim(p_reflection), '');
    v_completed boolean;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    if v_reflection is not null and char_length(v_reflection) > 600 then
        raise exception 'Reflection is too long';
    end if;

    select completed
    into v_completed
    from public.task_progress
    where user_id = v_user_id and task_id = p_task_id;

    if not coalesce(v_completed, false) then
        raise exception 'Complete the task before saving a reflection';
    end if;

    update public.task_progress
    set reflection = v_reflection,
        updated_at = now()
    where user_id = v_user_id and task_id = p_task_id;

    return jsonb_build_object(
        'task_id', p_task_id,
        'reflection', v_reflection
    );
end;
$$;

revoke execute on function public.set_task_reflection(text, text) from public, anon;
grant execute on function public.set_task_reflection(text, text) to authenticated;
