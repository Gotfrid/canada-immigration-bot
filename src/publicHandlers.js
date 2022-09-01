const {
  welcomeMessage,
  lastRoundMessage,
  last50Message,
  distributionMessage,
} = require("./utils");
const { Round, Subscriber, User, Distribution } = require("../mongo/schema");

const startHandler = async (bot, msg) => {
  // It makes sense to reset user in the DB when they `start`
  await User.findOneAndRemove({ chatID: msg.chat.id });
  await Subscriber.findOneAndRemove({ chatID: msg.chat.id });

  const newUser = new User({
    chatID: msg.chat.id,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    startedAt: new Date(msg.date * 1000),
  });

  await newUser.save();

  bot.sendMessage(msg.chat.id, welcomeMessage(msg.from.first_name), {
    parse_mode: "HTML",
  });
};

const testHandler = async (bot, msg) => {
  console.info("Received `test` command from", msg.chat.id);
  await bot.sendMessage(msg.chat.id, "bot is working");
};

const subscribeHandler = async (bot, msg) => {
  console.info("Received `subscribe` command from", msg.chat.id);
  const subscriber = await Subscriber.findOne({ chatID: msg.chat.id });
  if (subscriber === null) {
    const newSubscriber = new Subscriber({
      chatID: msg.chat.id,
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      subscribedAt: new Date(msg.date * 1000),
    });
    await newSubscriber.save();
    bot.sendMessage(
      msg.chat.id,
      "You are now subscribed!\nIf you want to stop receiving notifications, you can /unsubscribe."
    );
  } else {
    bot.sendMessage(
      msg.chat.id,
      "You are already subscribed!\nIf you want, you can /unsubscribe."
    );
  }
};

const unsubscribeHandler = async (bot, msg) => {
  console.info("Received `unsubscribe` command from", msg.chat.id);
  const subscriber = await Subscriber.findOne({ chatId: msg.chat.id });
  if (subscriber === null) {
    await bot.sendMessage(
      msg.chat.id,
      "You are not subscribed!\nIf you want to receive notifications, you can /subscribe."
    );
  } else {
    await Subscriber.findOneAndRemove({ chatID: msg.chat.id });
    await bot.sendMessage(
      msg.chat.id,
      "You have unsubscribed.\nIf you want to receive notifications again, you can /subscribe."
    );
  }
};

const lastHandler = async (bot, msg) => {
  console.info("Received `last` command from", msg.chat.id);
  const crsDocument = await Round.find().sort({ drawDate: -1 }).limit(1).exec();
  const message = lastRoundMessage(crsDocument[0]);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

const last50Handler = async (bot, msg) => {
  console.info("Received `last50` command from", msg.chat.id);
  const crsDocument = await Round.find()
    .sort({ drawDate: -1 })
    .limit(50)
    .exec();
  const message = last50Message(crsDocument);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

const changeHandler = async (bot, change, groupIds) => {
  if (change.operationType !== "insert") return;

  const message = lastRoundMessage(change.fullDocument, true);
  const subscribers = await Subscriber.find().select("chatID");
  const subscriberIds = subscribers.map((sub) => sub.chatID);

  // First, send message to the group(s) - they are the priority
  [...groupIds, ...subscriberIds].forEach(async (chatID) => {
    console.info("Sending notification to", chatID);
    // Possible failures: user has stopped the bot
    // but the DB still conains their chatID
    try {
      await bot.sendMessage(chatID, message, {
        parse_mode: "HTML",
      });
      console.info("Message has been sent.");
    } catch (error) {
      console.error("Message could not be sent.");
    }
  });
};

const distributionHandler = async (bot, msg) => {
  console.info("Received `distribution` command from", msg.chat.id);
  const crsDocument = await Distribution.find()
    .sort({ drawDate: -1 })
    .limit(1)
    .exec();
  const message = distributionMessage(crsDocument[0]);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

exports.startHandler = startHandler;
exports.testHandler = testHandler;
exports.subscribeHandler = subscribeHandler;
exports.unsubscribeHandler = unsubscribeHandler;
exports.lastHandler = lastHandler;
exports.last50Handler = last50Handler;
exports.changeHandler = changeHandler;
exports.distributionHandler = distributionHandler;
