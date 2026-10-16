-- Garante que toda conta tenha todas as habilidades iniciadas com zero XP.

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

    insert into public.skill_progress (user_id, skill_name, xp)
    select new.id, skill_name, 0
    from (values
        ('Confiança'),
        ('Verbalização'),
        ('Extroversão'),
        ('Oratória'),
        ('Coragem'),
        ('Empatia')
    ) as initial_skills(skill_name)
    on conflict (user_id, skill_name) do nothing;

    return new;
end;
$$;

-- Completa as habilidades de contas criadas antes desta migração sem apagar XP existente.
insert into public.skill_progress (user_id, skill_name, xp)
select users.id, initial_skills.skill_name, 0
from auth.users as users
cross join (values
    ('Confiança'),
    ('Verbalização'),
    ('Extroversão'),
    ('Oratória'),
    ('Coragem'),
    ('Empatia')
) as initial_skills(skill_name)
on conflict (user_id, skill_name) do nothing;
