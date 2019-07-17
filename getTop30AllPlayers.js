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
      let players = element.querySelectorAll(".rankingNicknames");
      for (let i = 0; i < players.length; i++) {
        data.push(players[i].innerText);
      }
    }
    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

let scrapeObj = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/june/3");

  const result = await page.evaluate(() => {
    let data = {}; // Create an empty array that will store our data
    let teams = document.querySelectorAll(".ranked-team"); // Select all Products
    for (var element of teams) {
      let players = element.querySelectorAll(".rankingNicknames");
      let lineup = [];
      for (let i = 0; i < players.length; i++) {
        lineup.push(players[i].innerText);
      }
      data[element.querySelector(".name").innerText] = lineup;
    }
    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  fs.writeFile("top30Players.csv", value, error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});

scrapeObj().then(value => {
  console.log(value);
});
