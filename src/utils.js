const { DASHBOARD_URL, SCREENSHOT_PATH } = require("./config");

/**
 *
 * @param {import("mongodb").MongoClient} mongo
 */
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

const downloadDashboardScreenshot = async () => {
  const puppeteer = require("puppeteer");
  await puppeteer
    .launch({ defaultViewport: { width: 1280, height: 630 } })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(DASHBOARD_URL);
      await page.waitForSelector(".echarts-for-react");
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: SCREENSHOT_PATH });
      await browser.close();
    });
};

module.exports = { setupMongoCleanup, downloadDashboardScreenshot };
