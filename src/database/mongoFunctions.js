const { MONGO_DB } = require("../config");
const client = require("./mongoClient");

const db = client.db(MONGO_DB);

const users = db.collection("users");
const subscribers = db.collection("subscribers");
const rounds = db.collection("rounds");
const distributions = db.collection("distributions");

const createUser = async (chatID, firstName, lastName, startedAt) => {
  await Promise.all([users.deleteOne({ chatID }), subscribers.deleteOne({ chatID })]);
  await users.insertOne({ chatID, firstName, lastName, startedAt });
};

const createSubscriber = async (chatID, firstName, lastName, subscribedAt) => {
  const oldSubscriber = await subscribers.findOne({ chatID });
  if (oldSubscriber !== null) {
    return false;
  }
  const newSubscriber = { chatID, firstName, lastName, subscribedAt };
  await subscribers.insertOne(newSubscriber);
  return true;
};

const removeSubscriber = async (chatID) => {
  const subscriber = await subscribers.findOne({ chatID });
  if (subscriber === null) {
    return false;
  }
  await subscribers.deleteOne({ chatID });
  return true;
};

const getLastDraw = async () => {
  const filter = {};
  const options = { sort: { drawDate: -1 } };
  return await rounds.findOne(filter, options);
};

const getLastNDraws = async (n) => {
  const filter = {};
  const options = { sort: { drawDate: -1 }, limit: n };
  return await rounds.find(filter, options).toArray();
};

const getLastDistribution = async () => {
  const filter = {};
  const options = { sort: { createdAt: -1 } };
  return await distributions.findOne(filter, options);
};

const getInternalStats = async () => {
  const promises = [rounds.countDocuments(), users.countDocuments(), subscribers.countDocuments()];
  const [totalRounds, totalUsers, totalSubscribers] = await Promise.all(promises);
  return { totalRounds, totalUsers, totalSubscribers };
};

const getAllSubscriberIds = async () => {
  const filter = {};
  const options = { projection: { chatID: 1, _id: 0 } };
  const ids = await subscribers.find(filter, options).toArray();
  return ids.map((subscriber) => subscriber.chatID);
};

module.exports = {
  createUser,
  createSubscriber,
  removeSubscriber,
  getLastDraw,
  getLastNDraws,
  getLastDistribution,
  getAllSubscriberIds,
  getInternalStats,
};
