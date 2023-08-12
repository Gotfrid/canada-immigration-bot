import os
from pprint import pprint

from pymongo import MongoClient

DATA_URL = os.environ["DATA_URL"]
CONNECTION_URL = os.environ["STAGE_MONGO_URI"]

client = MongoClient(CONNECTION_URL)

db = client.test

db.list_collection_names()


def get_latest_distribution():
    return db.distributions.find_one(filter={}, sort=[("drawDate", -1)])


def get_latest_round():
    return db.rounds.find_one(filter={}, sort=[("drawDate", -1)])


def get_latest_50_rounds():
    rounds = []
    cursor = db.rounds.find(filter={}, sort=[("drawDate", -1)]).limit(50)
    for round in cursor:
        rounds.append(round)
    return rounds
