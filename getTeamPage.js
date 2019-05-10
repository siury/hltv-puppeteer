const puppeteer = require("puppeteer");

let scrape = async (page, team) => {
  await page.goto(`https://www.hltv.org/search?query=${team}`);
  const result = await page.evaluate(() => {
    let teamPage = document.querySelector(".team-logo").parentNode.href; // Create an empty array that will store our data
    return teamPage; // Return our data array
  });
  return result; // Return the data
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

processTeamNames(["Liquid", "Astralis"]);
