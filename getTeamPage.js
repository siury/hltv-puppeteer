const puppeteer = require("puppeteer");
const teamname = "liquid";
let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://www.hltv.org/search?query=${teamname}`);

  const result = await page.evaluate(() => {
    let teamPage = document.querySelector(".team-logo").parentNode.href; // Create an empty array that will store our data
    return teamPage; // Return our data array
  });
  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success!
});
