const puppeteer = require("puppeteer");
const stringify = require("csv-stringify");
const fs = require("fs");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/may/6");

  const result = await page.evaluate(() => {
    let data = [
      [
        "ranking",
        "team_name",
        "player1",
        "player2",
        "player3",
        "player4",
        "player5"
      ]
    ]; // Create an empty array that will store our data
    let teams = document.querySelectorAll(".ranked-team"); // Select all Products

    for (var element of teams) {
      let team = [];
      let position = element.querySelector(".position").innerText;
      let name = element.querySelector(".name").innerText;
      team.push(position, name);
      let players = element.querySelectorAll(".rankingNicknames");
      for (var player of players) {
        team.push(player.innerText);
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
  stringify(value, function(err, output) {
    fs.writeFile("output.csv", output);
  });
});
