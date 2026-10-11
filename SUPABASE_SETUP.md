# Configuração do login e do banco

1. Crie um projeto em [supabase.com](https://supabase.com/).
2. No SQL Editor, execute `supabase/migrations/202609080001_auth_and_progress.sql`.
3. Copie `.env.example` para `.env` e preencha a URL e a chave publicável do projeto.
4. No painel do Supabase, em Authentication > Providers, mantenha Email habilitado. Defina se novos usuários precisam confirmar o e-mail.
5. Reinicie o Expo com `npm start`.

Nunca coloque a `service_role` no aplicativo. A chave publicável é protegida pelas políticas RLS; cada usuário só consegue ler seus próprios dados e toda alteração de progresso passa pela função transacional `set_task_completion`.

Sem `.env`, o aplicativo exibe o modo de demonstração e salva o progresso apenas no aparelho.
