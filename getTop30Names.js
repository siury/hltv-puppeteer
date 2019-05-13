const puppeteer = require("puppeteer");
const { convertArrayToCSV } = require("convert-array-to-csv");
const fs = require("fs");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/ranking/teams/2019/may/6");

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let teams = document.querySelectorAll(".ranked-team");

    for (var element of teams) {
      data.push(element.querySelector(".name").innerText);
    }
    return data; // Return our data array
  });

  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success
  let text = "";
  value.map(x => {
    text += x + "\n";
  });
  fs.writeFile("top30.txt", text, error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});
