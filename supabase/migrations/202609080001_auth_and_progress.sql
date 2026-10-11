-- NovaVoz: autenticação, progresso isolado por usuário e atualização sem conflitos.

create table if not exists public.task_catalog (
    task_id text primary key,
    skill_name text not null,
    xp_reward integer not null check (xp_reward between 1 and 100),
    created_at timestamptz not null default now()
);

insert into public.task_catalog (task_id, skill_name, xp_reward) values
    ('1', 'Extroversão', 20),
    ('2', 'Oratória', 30),
    ('3', 'Oratória', 40),
    ('4', 'Coragem', 20),
    ('5', 'Confiança', 30),
    ('6', 'Empatia', 20),
    ('7', 'Oratória', 40),
    ('8', 'Oratória', 30)
on conflict (task_id) do update
set skill_name = excluded.skill_name,
    xp_reward = excluded.xp_reward;

create table if not exists public.profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default '',
    xp integer not null default 0 check (xp >= 0),
    streak integer not null default 0 check (streak >= 0),
    last_completed_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.task_progress (
    user_id uuid not null references auth.users(id) on delete cascade,
    task_id text not null references public.task_catalog(task_id),
    completed boolean not null default false,
    xp_awarded boolean not null default false,
    updated_at timestamptz not null default now(),
    primary key (user_id, task_id)
);

create table if not exists public.skill_progress (
    user_id uuid not null references auth.users(id) on delete cascade,
    skill_name text not null,
    xp integer not null default 0 check (xp >= 0),
    updated_at timestamptz not null default now(),
    primary key (user_id, skill_name)
);

create index if not exists task_progress_user_id_idx on public.task_progress(user_id);
create index if not exists skill_progress_user_id_idx on public.skill_progress(user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (user_id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
    on conflict (user_id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (user_id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (user_id) do nothing;

alter table public.task_catalog enable row level security;
alter table public.profiles enable row level security;
alter table public.task_progress enable row level security;
alter table public.skill_progress enable row level security;

create policy "Authenticated users read task catalog"
on public.task_catalog for select
to authenticated
using (true);

create policy "Users read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read their own task progress"
on public.task_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read their own skill progress"
on public.skill_progress for select
to authenticated
using ((select auth.uid()) = user_id);

-- Uma trava por usuário + missão serializa cliques simultâneos vindos de vários aparelhos.
-- xp_awarded impede que desmarcar e concluir novamente gere XP duplicado.
create or replace function public.set_task_completion(
    p_task_id text,
    p_completed boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_skill_name text;
    v_base_xp integer;
    v_awarded_xp integer := 0;
    v_already_awarded boolean;
    v_streak integer;
    v_last_completed date;
    v_today date := (timezone('America/Sao_Paulo', now()))::date;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || p_task_id, 0));

    select skill_name, xp_reward
    into v_skill_name, v_base_xp
    from public.task_catalog
    where task_id = p_task_id;

    if not found then
        raise exception 'Unknown task';
    end if;

    insert into public.profiles (user_id)
    values (v_user_id)
    on conflict (user_id) do nothing;

    insert into public.task_progress (user_id, task_id)
    values (v_user_id, p_task_id)
    on conflict (user_id, task_id) do nothing;

    select xp_awarded
    into v_already_awarded
    from public.task_progress
    where user_id = v_user_id and task_id = p_task_id
    for update;

    if p_completed then
        if not v_already_awarded then
            select streak, last_completed_date
            into v_streak, v_last_completed
            from public.profiles
            where user_id = v_user_id
            for update;

            v_awarded_xp := round(v_base_xp * case
                when v_streak >= 15 then 1.2
                when v_streak >= 5 then 1.1
                else 1
            end)::integer;

            update public.profiles
            set xp = xp + v_awarded_xp,
                streak = case
                    when v_last_completed = v_today then streak
                    when v_last_completed = v_today - 1 then streak + 1
                    else 1
                end,
                last_completed_date = v_today,
                updated_at = now()
            where user_id = v_user_id;

            insert into public.skill_progress (user_id, skill_name, xp)
            values (v_user_id, v_skill_name, v_awarded_xp)
            on conflict (user_id, skill_name) do update
            set xp = public.skill_progress.xp + excluded.xp,
                updated_at = now();
        end if;

        update public.task_progress
        set completed = true,
            xp_awarded = true,
            updated_at = now()
        where user_id = v_user_id and task_id = p_task_id;
    else
        update public.task_progress
        set completed = false,
            updated_at = now()
        where user_id = v_user_id and task_id = p_task_id;
    end if;

    return jsonb_build_object(
        'task_id', p_task_id,
        'completed', p_completed,
        'xp_awarded_now', v_awarded_xp
    );
end;
$$;

revoke all on public.profiles from anon;
revoke all on public.task_progress from anon;
revoke all on public.skill_progress from anon;
revoke insert, update, delete on public.profiles from authenticated;
revoke insert, update, delete on public.task_progress from authenticated;
revoke insert, update, delete on public.skill_progress from authenticated;
revoke execute on function public.set_task_completion(text, boolean) from public, anon;
grant execute on function public.set_task_completion(text, boolean) to authenticated;
grant select on public.task_catalog, public.profiles, public.task_progress, public.skill_progress to authenticated;

