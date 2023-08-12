import os
import requests

DATA_URL = os.environ["DATA_URL"]
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"


def fetch_data():
    response = requests.get(DATA_URL, headers={"User-Agent": USER_AGENT})

    if not response.ok:
        raise Exception("Error fetching data")

    return response.json()


def parse_data(data: list[dict]):
    if not "rounds" in data:
        raise Exception("Invalid data format: expected 'rounds' key, but not found")

    rounds_raw = data["rounds"]
    rounds_parsed = []
    distributions_parsed = []

    for round in rounds_raw:
        rounds_parsed.append(extract_round_info(round))
        distributions_parsed.append(extract_distribution_info(round))

    return (rounds_parsed, distributions_parsed)


def extract_round_info(round):
    return list(
        drawNumber=round["drawNumber"],
        drawCRS=round["drawCRS"],
        drawDate=round["drawDate"],
        drawDateTime=round["drawDateTime"],
        drawSize=round["drawSize"],
        drawName=round["drawName"],
    )


def extract_distribution_info(round):
    return list(
        drawDate=round["drawDate"],
        dd1=round["dd1"],
        dd2=round["dd2"],
        dd3=round["dd3"],
        dd4=round["dd4"],
        dd5=round["dd5"],
        dd6=round["dd6"],
        dd7=round["dd7"],
        dd8=round["dd8"],
        dd9=round["dd9"],
        dd10=round["dd10"],
        dd11=round["dd11"],
        dd12=round["dd12"],
        dd13=round["dd13"],
        dd14=round["dd14"],
        dd15=round["dd15"],
        dd16=round["dd16"],
        dd17=round["dd17"],
        dd18=round["dd18"],
    )
