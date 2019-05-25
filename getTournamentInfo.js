const puppeteer = require("puppeteer");
const fs = require("fs");
const search = "https://www.hltv.org/search?query=";
const tournaments = [
  "BLAST Pro Series Madrid 2019",
  "ESL Pro League Season 9 Europe",
  "BLAST Pro Series Miami 2019",
  "BLAST Pro Series São Paulo 2019",
  "ECS Season 7 Europe Week 1",
  "IEM Katowice 2019",
  "iBUYPOWER Masters 2019",
  "BLAST Pro Series Lisbon 2018",
  "ESL Pro League Season 8 Finals",
  "ECS Season 6 Finals",
  "ESL Pro League Season 8 Europe",
  "IEM Chicago 2018",
  "BLAST Pro Series Copenhagen 2018",
  "ECS Season 6 Europe",
  "BLAST Pro Series Istanbul 2018",
  "FACEIT Major 2018",
  "FACEIT Major 2018 Main Qualifier",
  "DreamHack Masters Stockholm 2018",
  "ELEAGUE CS:GO Premier 2018",
  "ESL One Cologne 2018",
  "ECS Season 5 Finals",
  "ESL Pro League Season 7 Finals",
  "ECS Season 5 Europe",
  "IEM Sydney 2018",
  "ESL Pro League Season 7 Europe",
  "DreamHack Masters Marseille 2018",
  "IEM Sydney 2018 Europe Closed Qualifier",
  "IEM Katowice 2018",
  "StarSeries i-League Season 4",
  "ELEAGUE Major 2018",
  "ECS Season 7 North America Week 5",
  "cs_summit 4",
  "ECS Season 7 North America Week 4",
  "IEM Sydney 2019",
  "ESL Pro League Season 9 Americas",
  "ECS Season 7 North America Week 1",
  "SuperNova CS:GO Malta",
  "ESL Pro League Season 8 North America",
  "ECS Season 6 North America",
  "EPICENTER 2018",
  "ESL One New York 2018",
  "ESL One Belo Horizonte 2018",
  "StarSeries i-League Season 5",
  "ECS Season 5 North America",
  "ESL Pro League Season 7 North America",
  "IEM Sydney 2018 North America Closed Qualifier",
  "iBUYPOWER Invitational Spring 2018",
  "cs_summit 2",
  "StarSeries i-League Season 4 North America Qualifier",
  "IEM Katowice 2018 North America Closed Qualifier",
  "ELEAGUE Major 2018 Main Qualifier",
  "StarSeries i-League Season 7",
  "GG.BET ICE Challenge",
  "CS:GO Asia Championships 2018",
  "ECS Season 5 Europe Challenger Cup",
  "Farmskins Championship #2 - IEM Katowice 2018 Qualifier",
  "ESL Pro League Season 6 Europe Relegation",
  "IEM Katowice 2018 Europe Closed Qualifier",
  "ECS Season 7 Europe Week 5",
  "ECS Season 7 Europe Week 4",
  "ELEAGUE CS:GO Invitational 2019",
  "V4 Future Sports Festival",
  "ESEA MDL Season 31 Europe",
  "ESEA MDL Season 30 Europe",
  "IEM Katowice 2019 Main Qualifier",
  "ASUS ROG Winter 2019",
  "Europe Minor - IEM Katowice 2019",
  "Europe Minor Closed Qualifier - IEM Katowice 2019",
  "DreamHack Open Winter 2018",
  "WESG 2018 North Europe Qualifier 2",
  "WESG 2018 North Europe Qualifier 1",
  "ESEA MDL Season 29 Europe",
  "Assembly GameXpo 2018",
  "GG.BET Shuffle - IEM Chicago Qualifier",
  "StarSeries i-League Season 6",
  "ECS Season 6 Europe Qualifier 1",
  "DreamHack Open Montreal 2018",
  "ESEA MDL Season 28 Europe Relegation",
  "EPICENTER 2018 Europe Closed Qualifier",
  "IEM Chicago 2018 Europe Closed Qualifier",
  "Finnish Championships 2018",
  "ESEA Advanced Season 28 Europe",
  "Europe Minor - FACEIT Major 2018",
  "Europe Minor Closed Qualifier - FACEIT Major 2018",
  "DreamHack Masters Stockholm 2018 Europe Open Qualifier",
  "Europe Minor Open Qualifier 4 - FACEIT Major 2018",
  "Vectorama LAN 2018",
  "GG.BET Majestic - ESL One Cologne Qualifier",
  "GG.BET Majestic Closed Qualifier",
  "DreamHack Open Valencia 2018 Europe Closed Qualifier",
  "DreamHack Open Valencia 2018 Europe Open Qualifier",
  "ESL One Belo Horizonte Europe Open Qualifier",
  "ECS Season 7 Europe Week 2",
  "WESG 2018 World Finals",
  "PLG Grand Slam 2018",
  "WESG 2017 World Finals",
  "Showmatch CS:GO",
  "ECS Season 6 North America Challenger Cup",
  "ZOTAC Cup Masters 2018 Grand Finals",
  "ECS Season 7 North America Week 2",
  "Americas Minor - IEM Katowice 2019",
  "Americas Minor North America Closed Qualifier - IEM Katowice 2019",
  "cs_summit 3",
  "EPICENTER 2018 North America Closed Qualifier",
  "IEM Shanghai 2018",
  "StarSeries i-League Season 6 North America Qualifier",
  "Americas Minor - FACEIT Major 2018",
  "ESL One New York 2018 North America Closed Qualifier",
  "Americas Minor North America Closed Qualifier - FACEIT Major 2018",
  "StarSeries i-League Season 5 North America Qualifier",
  "ESL One Belo Horizonte North America Closed Qualifier",
  "DreamHack Masters Marseille 2018 North America Closed Qualifier",
  "Asia Minor - IEM Katowice 2019",
  "Toyota Master Bangkok 2018",
  "Asia Minor Oceania Closed Qualifier - IEM Katowice 2019",
  "Asia Minor - FACEIT Major 2018",
  "DreamHack Open Summer 2018",
  "ESL One Cologne 2018 North America Closed Qualifier",
  "ESL One Cologne 2019 Europe Closed Qualifier",
  "ECS Season 7 Europe Week 3",
  "Charleroi Esports"
];

let scrape = async (page, tourn) => {
  // Get the number values array from a string including numbers
  await page.goto(search + tourn.replace(" ", "+"));
  const next = await page.evaluate(async () => {
    return document.querySelector("td a").href;
  });
  await page.goto(next);
  const result = await page.evaluate(async () => {
    let data = {};
    data.title = document.querySelector(".eventname").innerText;
    data.location = document.querySelector(".flag").title;
    data.prize_pool = document
      .querySelector("td.prizepool")
      .innerText.replace(",", "");
    data.teams_attending = document.querySelector("td.teamsNumber").innerText;
    return data;
  });
  return result;
};

async function processTournaments(tournaments) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  for (const t of tournaments) {
    const output = await scrape(page, t);
    let data = Object.values(output).join(",") + "\n";
    fs.appendFile("tournaments.csv", data, error => {
      error === null
        ? console.log("Successfully Added ")
        : console.log("Error:" + error);
    });
  }
  browser.close();
}

processTournaments(tournaments); //change to test-matches.txt or all-matches.txt
