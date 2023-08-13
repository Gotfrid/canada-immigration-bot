const setupMongoCleanup = (mongo) => {
  process.on("exit", async () => {
    await mongo.close();
  });

  process.on("SIGINT", async () => {
    await mongo.close();
    process.exit();
  });

  // process.on("uncaughtException", async () => {
  //   await mongo.close();
  //   process.exit();
  // });
};

module.exports = { setupMongoCleanup };
