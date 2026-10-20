-- Expande a jornada principal para cinco níveis e vinte e cinco missões.

insert into public.task_catalog (task_id, skill_name, xp_reward) values
    ('1', 'Extroversão', 10),
    ('4', 'Coragem', 10),
    ('6', 'Empatia', 10),
    ('9', 'Empatia', 10),
    ('10', 'Confiança', 20),
    ('2', 'Extroversão', 20),
    ('11', 'Extroversão', 20),
    ('12', 'Empatia', 20),
    ('13', 'Empatia', 20),
    ('14', 'Confiança', 20),
    ('3', 'Verbalização', 30),
    ('5', 'Confiança', 30),
    ('8', 'Coragem', 30),
    ('15', 'Confiança', 30),
    ('16', 'Verbalização', 30),
    ('17', 'Verbalização', 40),
    ('18', 'Verbalização', 40),
    ('19', 'Oratória', 40),
    ('7', 'Oratória', 40),
    ('20', 'Oratória', 40),
    ('21', 'Oratória', 50),
    ('22', 'Oratória', 50),
    ('23', 'Confiança', 50),
    ('24', 'Oratória', 50),
    ('25', 'Oratória', 50)
on conflict (task_id) do update
set skill_name = excluded.skill_name,
    xp_reward = excluded.xp_reward;
