const puppeteer = require("puppeteer");
const fs = require("fs");

let scrape = async (page, url) => {
  // Get the number values array from a string including numbers
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const getNumsFromString = string => {
      return string.split(" ").filter(x => !isNaN(x));
    };

    const getNumsFromParantheses = string => {
      return string
        .replace(/[{()}]/g, "")
        .trim()
        .split(" ");
    };
    let data = [];
    // Match ID
    const matchId = window.location.href.split("/")[6];
    // Tournament Name
    const tournament = document.querySelector(".match-info-box a").innerText;
    // Match Date
    const date = document.querySelector(".match-info-box .small-text span")
      .innerText;
    // Map Played
    const map = document
      .querySelector(".match-info-box")
      .childNodes[3].nodeValue.trim();
    // Names of the Two Teams
    const team1 = document.querySelector(".team-left img").title;
    const team2 = document.querySelector(".team-right img").title;

    const players = document.querySelectorAll(".stats-table tbody tr");
    for (let i = 0; i < players.length; i++) {
      let player = {};
      // Player Name
      player.name = players[i].querySelector(".st-player").innerText;
      // Map
      player.map = map;
      // Match Date
      player.date = date;
      // MatchId
      player.matchId = matchId;
      // Tournament
      player.tournament = tournament;
      // Player Team
      player.team = i < 5 ? team1 : team2;
      // Enemy Team
      player.against = i < 5 ? team2 : team1;
      // Player Kills
      // Player Headshots
      [player.kills, player.headshots] = getNumsFromParantheses(
        players[i].querySelector(".st-kills").innerText
      );
      // Player Assists
      // Player Successful Flashbangs
      [player.assists, player.hit_flashbangs] = getNumsFromParantheses(
        players[i].querySelector(".st-assists").innerText
      );
      // Player Deaths
      player.deaths = players[i].querySelector(".st-deaths").innerText.trim();
      // Player Kill/Assists/Survived/Traded score (KAST)
      player.kast = players[i].querySelector(".st-kdratio").innerText.trim();
      // Player Avg Damage per Round
      player.adr = players[i].querySelector(".st-adr").innerText.trim();
      // Player First Kills
      // Player First Deaths
      [player.opening_kills, player.opening_deaths] = getNumsFromString(
        players[i].querySelector(".st-fkdiff").title
      );
      // Player HLTV Rating
      player.rating = players[i].querySelector(".st-rating").innerText.trim();
      data.push(player);
    }
    return data;
  });
  return result;
};

async function processUrls(urls) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  for (const url of urls) {
    const output = await scrape(page, url);
    for (let player of output) {
      let stats = Object.values(player).join(",") + "\n";
      fs.appendFile("players.csv", stats, error => {
        error === null
          ? console.log("Successfully Added " + player.name + " from " + url)
          : console.log("Error:" + error);
      });
    }
  }
  browser.close();
}

fs.readFile("all-matches.txt", "utf-8", (err, data) => {
  if (err) throw err;
  processUrls(data.trim().split("\n"));
});
