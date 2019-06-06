const puppeteer = require("puppeteer");
const fs = require("fs");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/june/3");

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
  let text = "position,name\n";
  for (let team of value) {
    text += team.position.replace("#", "") + "," + team.name + "\n";
  }
  fs.writeFile("top30.csv", text, error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});
