const { MONGO_DB } = require("../config");
const client = require("./mongoClient");

const db = client.db(MONGO_DB);

const users = db.collection("users");
const subscribers = db.collection("subscribers");
const rounds = db.collection("rounds");
const distributions = db.collection("distributions");

/**
 *
 * @param {number} chatID
 * @param {string | undefined} firstName
 * @param {string | undefined} lastName
 * @param {Date} startedAt
 * @returns {Promise<void>}
 */
const createUser = async (chatID, firstName, lastName, startedAt) => {
  await Promise.all([users.deleteOne({ chatID }), subscribers.deleteOne({ chatID })]);
  await users.insertOne({ chatID, firstName, lastName, startedAt });
};

/**
 *
 * @param {number} chatID
 * @param {string | undefined} firstName
 * @param {string | undefined} lastName
 * @param {Date} subscribedAt
 * @returns {Promise<boolean>}
 */
const createSubscriber = async (chatID, firstName, lastName, subscribedAt) => {
  const oldSubscriber = await subscribers.findOne({ chatID });
  if (oldSubscriber !== null) {
    return false;
  }
  const newSubscriber = { chatID, firstName, lastName, subscribedAt };
  await subscribers.insertOne(newSubscriber);
  return true;
};

/**
 *
 * @param {number} chatID
 * @returns {Promise<boolean>}
 */
const removeSubscriber = async (chatID) => {
  const subscriber = await subscribers.findOne({ chatID });
  if (subscriber === null) {
    return false;
  }
  await subscribers.deleteOne({ chatID });
  return true;
};

/**
 *
 * @returns {Promise<RoundClean | null>}
 */
const getLastDraw = async () => {
  const filter = {};
  const sortDirection = /** @type {const} */ (-1);
  const options = { sort: { drawDate: sortDirection } };
  const result = await rounds.findOne(filter, options);
  return /** @type {RoundClean | null} */ (result);
};

/**
 *
 * @param {number} n
 * @returns {Promise<RoundClean[]>}
 */
const getLastNDraws = async (n) => {
  const filter = {};
  const sortDirection = /** @type {const} */ (-1);
  const options = { sort: { drawDate: sortDirection }, limit: n };
  const result = /** @type {unknown} */ (await rounds.find(filter, options).toArray());
  return /** @type {RoundClean[]} */ (result);
};

/**
 *
 * @returns {Promise<DistributionClean | null>}
 */
const getLastDistribution = async () => {
  const filter = {};
  const sortDirection = /** @type {const} */ (-1);
  const options = { sort: { createdAt: sortDirection } };
  const result = await distributions.findOne(filter, options);
  return /** @type {DistributionClean | null} */ (result);
};

const getInternalStats = async () => {
  const promises = [rounds.countDocuments(), users.countDocuments(), subscribers.countDocuments()];
  const [totalRounds, totalUsers, totalSubscribers] = await Promise.all(promises);
  return { totalRounds, totalUsers, totalSubscribers };
};

/**
 *
 * @returns {Promise<number[]>}
 */
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
