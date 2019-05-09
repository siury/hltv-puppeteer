const puppeteer = require("puppeteer");
const { convertArrayToCSV } = require("convert-array-to-csv");
const fs = require("fs");

const url =
  "https://www.hltv.org/stats/matches/mapstatsid/85427/liquid-vs-fnatic?contextIds=5973&contextTypes=team";

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    return data; // Return our data array
  });
  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success!
  const output = convertArrayToCSV(value);
  fs.writeFile("output.csv", output, "utf8", error => {
    console.log(error);
  });
});
