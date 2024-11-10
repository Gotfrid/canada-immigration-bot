# Canada Immigration Bot

## Tooling

1. Supabase CLI
2. Deno
3. Github Actions

```sh
supabase login
supabase projects list
supabase link --project-ref
```

## Set telegram bot to serverless mode

```sh
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://PROJECT_RED.supabase.co/functions/v1/telegram-bot?secret=MY_SECRET
```
