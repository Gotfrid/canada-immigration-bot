# Canada Immigration Bot

Telegram bot to track latest drafts for [Express Entry](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html) immigration program. Click to follow: https://t.me/CaImmigrationBot.

## Features

**Implemented**:

- Subscribe to get notified about the latest round. Time margin should not exceed ~5 minutes.
- Get information about the last round
- Get information about last 50 rounds

**Planned**:

- Get score distribution for a given round
- Use webhooks instead of polling

## Infrastructure

The bot is deployed to [fly.io](http://fly.io/) and should be redeployed manually via CLI. The bot is working in polling mode.

Historical data is stored in a MongoDB which is deployed at [MongoDB Atlas](https://www.mongodb.com/atlas).

New data is checked with an [AWS Lambda](https://aws.amazon.com/lambda/) function which is invoked every 5 minutes. If new data is found, it is pushed to the MongoDB, which triggers an event in the bot app. This way, bot subscribers will receive notifications about a new round.

## AWS Lambda Deployment

This bot relies on a lambda fucntion that runs every 5 minutes and pushed new data (if any) to the MongoDB.

This function is deployed as a zip archive that includes all contents of this repo, except for the _config_ folder. To prepare this archive, run:

```sh
zip -r deploy.zip ./src ./node_modules ./package.json ./index.js
```

## Contributing

TODO: code of contibuting?
