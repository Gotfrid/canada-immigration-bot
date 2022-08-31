# Canada Immigration Bot

Telegram bot to track latest drafts for [Express Entry](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html) immigration program. Click to follow: https://t.me/CaImmigrationBot.

## Features

__Implemented__:
* Subscribe to get notified about the latest round. Time margin should not exceed ~5 minutes.
* Get information about the last round
* Get information about last 50 rounds

__Planned__:
* Get score distribution for a given round
* Use webhooks instead of polling

## Infrastructure

The bot is deployed to [Heroku](http://heroku.com/) and is re-deployed on each push to main branch. The bot is working in polling mode.

Historical data is stored in a MongoDB which is deployed at [MongoDB Atlas](https://www.mongodb.com/atlas).

New data is checked with an [AWS Lambda](https://aws.amazon.com/lambda/) function which is invoked every 5 minutes. If new data is found, it is pushed to the MongoDB, which triggers an event in the bot app. This way, bot subscribers will receive notifications about a new round.

## Contributing
Please feel free to open issues if you face any problems or have improvement suggestions.

You can also reach out to me directly via paveldemin@me.com or [Telegram](https://t.me/Gotfr1d).
