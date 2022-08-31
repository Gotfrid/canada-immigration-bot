### AWS Lambda Deployment
This bot relies on a lambda fucntion that runs every 5 minutes and pushed new data (if any) to the MongoDB.

This function is deployed as a zip archive that includes all contents of this repo, except for the _config_ folder. To prepare this archive, run:

```sh
zip -r deploy.zip ./aws ./mongo ./node_modules ./package.json ./index.js -x ./aws/rounds.json
```
