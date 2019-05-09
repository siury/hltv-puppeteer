const puppeteer = require("puppeteer");
const { convertArrayToCSV } = require("convert-array-to-csv");
const fs = require("fs");

const urls = [
  "https://www.hltv.org/stats/matches/mapstatsid/79888/flash-vs-mvp-pk",
  "https://www.hltv.org/stats/matches/mapstatsid/85427/liquid-vs-fnatic?contextIds=4991&contextTypes=team",
  "https://www.hltv.org/stats/matches/mapstatsid/74787/faze-vs-g2"
];

let scrape = async url => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    let data = {}; // Each match is an object, must be put in array before converted to csv
    data.matchId = window.location.href.split("/")[6];
    data.tournament = document.querySelector(".match-info-box a").innerText;
    data.date = document.querySelector(
      ".match-info-box .small-text span"
    ).innerText;
    data.map = document
      .querySelector(".match-info-box")
      .childNodes[3].nodeValue.trim();
    data.team1 = document.querySelector(".team-left img").title;
    data.team2 = document.querySelector(".team-right img").title;
    data.winner = document
      .querySelector(".bold.won")
      .parentElement.querySelector("img").title;
    data.team1_rounds = document.querySelector(".team-left .bold").innerText;
    data.team2_rounds = document.querySelector(".team-right .bold").innerText;
    return data;
  });
  browser.close();
  return result;
};

async function processUrls(urls) {
  const out = [];
  for (const url of urls) {
    const output = await scrape(url);
    out.push(output);
  }
  fs.writeFile("output.csv", convertArrayToCSV(out), error => {
    console.log(error);
  });
}

processUrls(urls);

/* const output = convertArrayToCSV(out);
fs.writeFile("output.csv", output, "utf8", error => {
  console.log(error);
});
 */
