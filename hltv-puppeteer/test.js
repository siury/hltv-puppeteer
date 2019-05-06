const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/april/29");

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let teams = document.querySelectorAll(".ranked-team"); // Select all Products

    for (var element of teams) {
      let position = element.querySelector(".position").innerText;
      let name = element.querySelector(".name").innerText;
      data.push({ position, name });
      let players = element.querySelectorAll(".rankingNicknames");
      let lineup = [];
      for (var player of players) {
        lineup.push(player.innerText);
      }
      data.push(lineup);
    }

    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success!
});
