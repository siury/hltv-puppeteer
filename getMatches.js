const puppeteer = require("puppeteer");
const fs = require("fs");

let scrape = async (page, match) => {
  await page.goto(match);
  const result = await page.evaluate(async () => {
    Date.prototype.getUnixTime = function() {
      return (this.getTime() / 1000) | 0;
    };
    const getUnix = time => {
      const newTime = new Date(time);
      return newTime.getUnixTime();
    };
    const cutOff = await getUnix("01 01 19"); // January 1, 2019
    const matches = document.querySelectorAll("tbody tr");
    let overall = [];
    for (let match of matches) {
      let data = {};
      let date = match.querySelector(".time").innerText.split("/");
      date = date[1] + " " + date[0] + " " + date[2];
      let matchDate = await getUnix(date);
      if (cutOff > matchDate) {
        break;
      } else {
        data.link = match.querySelector(".time a").href;
        data.id = data.link.split("/")[6];
        overall.push(data);
      }
    }
    return overall;
  });
  return result;
};

async function getMatches(teams) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let out = [];
  let ids = new Set();
  for (let team of teams) {
    let output = await scrape(page, team);
    for (let x of output) {
      if (!ids.has(x.id)) {
        ids.add(x.id);
        out.push(x.link);
      }
    }
  }
  browser.close();
  let text = "";
  out.map(x => {
    text += x + "\n";
  });
  text = text.trim();

  fs.writeFile("all-matches.txt", text, error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
}

fs.readFile("./matches.txt", "utf-8", (err, data) => {
  if (err) throw err;
  getMatches(data.trim().split("\n"));
});
