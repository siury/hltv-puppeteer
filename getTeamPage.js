const puppeteer = require("puppeteer");
const fs = require("fs");
let scrape = async (page, team) => {
  await page.goto(`https://www.hltv.org/search?query=${team}`);
  const teamPage = await page.evaluate(() => {
    let page = document.querySelector(".team-logo").parentNode.href; // Create an empty array that will store our data
    return page;
  });
  await page.goto(teamPage);
  const matchesPage = await page.evaluate(() => {
    let link = window.location.href.split("/");
    return (
      "https://www.hltv.org/stats/teams/matches/" + link[4] + "/" + link[5]
    );
  });
  return matchesPage;
};

async function processTeamNames(teams) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const out = [];
  for (const team of teams) {
    const output = await scrape(page, team);
    out.push(output);
  }
  browser.close();
  console.log(out);
}

fs.readFile("./top30.txt", "utf-8", (err, data) => {
  if (err) throw err;
  processTeamNames(data.trim().split("\n"));
});
