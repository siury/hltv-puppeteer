const puppeteer = require("puppeteer");
const fs = require("fs");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://www.hltv.org/news/25735/top-20-players-of-2018-introduction"
  );

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let players = document.querySelectorAll("blockquote .news-block")[1];
    let flags = players.querySelectorAll("img");
    let names = players.querySelectorAll("a");
    for (let i = 0; i < 20; i++) {
      data.push({ name: names[i].innerText, loc: flags[i].alt, pos: i + 1 });
    }
    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  let text = "";
  for (let player of value) {
    text += player.name + "," + player.loc + "," + player.pos + "\n";
  }
  fs.writeFile("top20.csv", text, error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});
