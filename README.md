# Express Entry Bot

## Reference

[Telegram Bot on Supabase Edge example](https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/telegram-bot/README.md)

## Tooling

1. Docker
2. Supabase CLI
3. Deno
4. Github Actions

```sh
supabase login
supabase projects list
supabase link --project-ref
```

## Telegram bot

### Set telegram bot to serverless mode

```sh
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://PROJECT_RED.supabase.co/functions/v1/telegram-bot?secret=MY_SECRET
```

### Deploy telegram bot on supabase edge function

```sh
supabase functions deploy --no-verify-jwt telegram-bot
```

## Data Update

### Compile deno script

// #TODO: if it's not possible to have a smaller bundle, then it doesn' make sense.

```sh
deno compile -A --output ./.github/workflows/update_data github_action.ts
```
