const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/march/25");

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let teams = document.querySelectorAll(".ranked-team"); // Select all Products

    for (var element of teams) {
      let team = {};
      team.position = element.querySelector(".position").innerText;
      team.name = element.querySelector(".name").innerText;
      let players = element.querySelectorAll(".rankingNicknames");
      for (let i = 0; i < players.length; i++) {
        team["player" + i] = players[i].innerText;
      }
      data.push(team);
    }
    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success!
});
