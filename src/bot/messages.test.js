const {
  welcomeMessage,
  lastRoundMessage,
  last50Message,
  distributionMessage,
  aboutMessage,
  dashboardMessage,
  subscribedMessage,
  alreadyUnsubscribedMessage,
  alreadySubscribedMessage,
  unsubscribedMessage,
  standardizeProgramName,
} = require("./messages");

/** @type {RoundClean} */
const MOCK_ROUND = {
  drawNumber: "1",
  drawName: "Express Entry",
  drawDate: "2022-01-01",
  drawDateTime: "2022-01-01T12:00:00.000Z",
  drawCRS: 500,
  drawSizeStr: "5000",
  drawSizeNum: 5000,
  drawDateFull: "2022-01-01",
};

/** @type {RoundClean[]} */
const MOCK_ROUNDS = [
  MOCK_ROUND,
  {
    drawNumber: "2",
    drawName: "Express Entry",
    drawDate: "2022-01-02",
    drawDateTime: "2022-01-02T12:00:00.000Z",
    drawCRS: 510,
    drawSizeStr: "5100",
    drawSizeNum: 5100,
    drawDateFull: "2022-01-02",
  },
];

/** @type {DistributionClean} */
const MOCK_DISTRIBUTION = {
  drawNumber: "1",
  drawDate: "2022-01-01",
  drawDistributionAsOn: "2022-01-01",
  dd1: 400,
  dd2: 450,
  dd3: 500,
  dd4: 500,
  dd5: 500,
  dd6: 500,
  dd7: 500,
  dd8: 500,
  dd9: 550,
  dd10: 600,
  dd11: 600,
  dd12: 600,
  dd13: 600,
  dd14: 600,
  dd15: 600,
  dd16: 650,
  dd17: 700,
  dd18: 10000,
};

describe("welcomeMessage", () => {
  test("returns a string", () => {
    const message = welcomeMessage("John");
    expect(typeof message).toBe("string");
  });

  test("includes a greeting", () => {
    const message = welcomeMessage();
    expect(message).toContain("Welcome");
  });

  test("has a fallback when username is not profided", () => {
    const fallback = "friend";
    const message = welcomeMessage();
    expect(message).toContain(fallback);
  });

  test("includes the user's name when provided", () => {
    const userName = "John";
    const message = welcomeMessage(userName);
    expect(message).toContain(userName);
  });
});

describe("lastRoundMessage", () => {
  test("returns a string", () => {
    const message = lastRoundMessage(MOCK_ROUND);
    expect(typeof message).toBe("string");
  });

  test("includes the draw name", () => {
    const message = lastRoundMessage(MOCK_ROUND);
    expect(message).toContain(MOCK_ROUND.drawName);
  });

  test("includes the draw date", () => {
    const message = lastRoundMessage(MOCK_ROUND);
    expect(message).toContain(MOCK_ROUND.drawDate);
  });

  test("includes the CRS score", () => {
    const message = lastRoundMessage(MOCK_ROUND);
    expect(message).toContain(MOCK_ROUND.drawCRS.toString());
  });

  test("includes the draw size", () => {
    const message = lastRoundMessage(MOCK_ROUND);
    expect(message).toContain(MOCK_ROUND.drawSizeStr);
  });

  test("includes a title if specified", () => {
    const message = lastRoundMessage(MOCK_ROUND, true);
    expect(message).toContain("New round");
  });
});

describe("last50Message", () => {
  test("returns a string", () => {
    const message = last50Message(MOCK_ROUNDS);
    expect(typeof message).toBe("string");
  });

  test("includes a table with 3 columns", () => {
    const message = last50Message(MOCK_ROUNDS);
    expect(message).toContain("|    Date    | Score | Program |");
    expect(message).toContain("|------------|-------|---------|");
    expect(message).toContain("| 2022-01-02 |   510 | OTHER   |");
    expect(message).toContain("| 2022-01-01 |   500 | OTHER   |");
  });
});

describe("distributionMessage", () => {
  test("returns a string", () => {
    const message = distributionMessage(MOCK_DISTRIBUTION);
    expect(typeof message).toBe("string");
  });

  test("includes the title", () => {
    const message = distributionMessage(MOCK_DISTRIBUTION);
    expect(message).toContain("CRS score distribution");
  });

  test("includes the subtitle with the correct date", () => {
    const message = distributionMessage(MOCK_DISTRIBUTION);
    expect(message).toContain("2022-01-01");
  });

  test("includes the table with the correct headings and data", () => {
    const message = distributionMessage(MOCK_DISTRIBUTION);
    expect(message).toContain("|  Range   | Candidates |");
    expect(message).toContain("| 601-1200 |        400 |");
  });

  test("includes the footer with the correct total", () => {
    const message = distributionMessage(MOCK_DISTRIBUTION);
    expect(message).toContain("10000");
  });
});

describe("aboutMessage", () => {
  test("returns a string", () => {
    const message = aboutMessage();
    expect(typeof message).toBe("string");
  });

  test("includes the title", () => {
    const message = aboutMessage();
    expect(message).toContain("Hey");
  });

  test("includes a link in the dashboard", () => {
    const message = aboutMessage();
    expect(message).toContain("https://canadian-express.vercel.app");
  });
});

describe("dashboardMessage", () => {
  test("returns a string", () => {
    const message = dashboardMessage();
    expect(typeof message).toBe("string");
  });

  test("includes a link in the dashboard", () => {
    const message = dashboardMessage();
    expect(message).toContain("https://canadian-express.vercel.app");
  });
});

describe("subscribedMessage", () => {
  test("returns a string", () => {
    const message = subscribedMessage();
    expect(typeof message).toBe("string");
  });

  test("has required words", () => {
    const message = subscribedMessage();
    expect(message).toContain("subscribed");
  });
});

describe("unsubscribedMessage", () => {
  test("returns a string", () => {
    const message = unsubscribedMessage();
    expect(typeof message).toBe("string");
  });

  test("has required words", () => {
    const message = unsubscribedMessage();
    expect(message).toContain("unsubscribed");
  });
});

describe("alreadySubscribedMessage", () => {
  test("returns a string", () => {
    const message = alreadySubscribedMessage();
    expect(typeof message).toBe("string");
  });

  test("has required words", () => {
    const message = alreadySubscribedMessage();
    expect(message).toContain("already subscribed");
  });
});

describe("alreadyUnsubscribedMessage", () => {
  test("returns a string", () => {
    const message = alreadyUnsubscribedMessage();
    expect(typeof message).toBe("string");
  });

  test("has required words", () => {
    const message = alreadyUnsubscribedMessage();
    expect(message).toContain("not subscribed");
  });
});

describe("standardizeProgramName", () => {
  test("returns 'N/A' for 'No Program Specified'", () => {
    const result = standardizeProgramName("No Program Specified");
    expect(result).toBe("N/A");
  });

  test("returns 'PNP' for 'Provincial Nominee Program'", () => {
    const result = standardizeProgramName("Provincial Nominee Program");
    expect(result).toBe("PNP");
  });

  test("returns 'CEC' for 'Canadian Experience Class'", () => {
    const result = standardizeProgramName("Canadian Experience Class");
    expect(result).toBe("CEC");
  });

  test("returns 'FSW' for 'Federal Skilled Worker'", () => {
    const result = standardizeProgramName("Federal Skilled Worker");
    expect(result).toBe("FSW");
  });

  test("returns 'OTHER' for any other input", () => {
    const result = standardizeProgramName("Some Other Program");
    expect(result).toBe("OTHER");
  });
});
