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
https://api.telegram.org/botREDACTED/setWebhook?url=https://REDACTED.supabase.co/functions/v1/telegram-bot?secret=REDACTED
```
