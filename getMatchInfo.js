const puppeteer = require("puppeteer");
const { convertArrayToCSV } = require("convert-array-to-csv");
const fs = require("fs");

const urls = [
  "https://www.hltv.org/stats/matches/mapstatsid/79888/flash-vs-mvp-pk",
  "https://www.hltv.org/stats/matches/mapstatsid/85427/liquid-vs-fnatic?contextIds=4991&contextTypes=team",
  "https://www.hltv.org/stats/matches/mapstatsid/74787/faze-vs-g2"
];

let scrape = async (page, url) => {
  await page.goto(url);

  const result = await page.evaluate(async () => {
    const getNameFromMaxStat = (array, which, type = "max") => {
      let max = parseFloat(
        array.querySelectorAll(which)[1].innerText.split("(")[0]
      );
      let ind = 1;
      if (type === "max") {
        for (let i = 1; i <= 5; i++) {
          let stat = parseFloat(
            array.querySelectorAll(which)[i].innerText.split("(")[0]
          );
          if (stat > max) {
            ind = i;
            max = stat;
          }
        }
      } else {
        for (let i = 1; i <= 5; i++) {
          let stat = parseFloat(
            array.querySelectorAll(which)[i].innerText.split("(")[0]
          );
          if (stat < max) {
            ind = i;
            max = stat;
          }
        }
      }
      return [
        array
          .querySelectorAll(".st-kills")
          [ind].parentElement.querySelector(".st-player a").innerText,
        max
      ];
    };

    let data = {};
    // Match ID
    data.matchId = window.location.href.split("/")[6];
    // Tournament Name
    data.tournament = document.querySelector(".match-info-box a").innerText;

    // Match Date
    data.date = document.querySelector(
      ".match-info-box .small-text span"
    ).innerText;

    // Map Played
    data.map = document
      .querySelector(".match-info-box")
      .childNodes[3].nodeValue.trim();

    // Names of the Two Teams
    data.team1 = document.querySelector(".team-left img").title;
    data.team2 = document.querySelector(".team-right img").title;

    // Winner of the Match
    data.winner = document
      .querySelector(".bold.won")
      .parentElement.querySelector("img").title;

    // Score of Team1
    data.team1_rounds = document.querySelector(".team-left .bold").innerText;

    // Score of Team2
    data.team2_rounds = document.querySelector(".team-right .bold").innerText;

    let halfScores = document
      .querySelector(".match-info-row .right")
      .innerText.split(/[\:\(\)]/);
    halfScores = halfScores.map(x => x.trim());

    // Scores with halftime split for each team
    data.team1_first_half = halfScores[2];
    data.team1_second_half = halfScores[5];
    data.team2_first_half = halfScores[3];
    data.team2_second_half = halfScores[6];

    // Teams opening kills
    [data.team1_opening_kills, data.team2_opening_kills] = document
      .querySelectorAll(".match-info-row")[2]
      .querySelector(".right")
      .innerText.split(":")
      .map(x => {
        return parseInt(x.trim());
      });

    [data.team1_clutches, data.team2_clutches] = document
      .querySelectorAll(".match-info-row")[3]
      .querySelector(".right")
      .innerText.split(":")
      .map(x => {
        return parseInt(x.trim());
      });

    let [team1Stats, team2Stats] = document.querySelectorAll(".stats-table");

    [
      // Team 1 Most Kills (name, score)
      data.team1_most_kills_player,
      data.team1_most_kills
    ] = await getNameFromMaxStat(team1Stats, ".st-kills");
    // Team 2 Most Kills (name, score)
    [
      data.team2_most_kills_player,
      data.team2_most_kills
    ] = await getNameFromMaxStat(team2Stats, ".st-kills");
    // Team 1 Most Assists (name, score)
    [
      data.team1_most_assists_player,
      data.team1_most_assists
    ] = await getNameFromMaxStat(team1Stats, ".st-assists");
    // Team 2 Most Assists (name, score)
    [
      data.team2_most_assists_player,
      data.team2_most_assists
    ] = await getNameFromMaxStat(team2Stats, ".st-assists");
    // Team 1 Most Deaths (name, score)
    [
      data.team1_most_deaths_player,
      data.team1_most_deaths
    ] = await getNameFromMaxStat(team1Stats, ".st-deaths");
    // Team 2 Most Deaths (name, score)
    [
      data.team2_most_deaths_player,
      data.team2_most_deaths
    ] = await getNameFromMaxStat(team2Stats, ".st-deaths");
    // Team 1 Highest AVG Damage per round (name, score)
    [
      data.team1_most_damage_per_round_player,
      data.team1_most_damage_per_round
    ] = await getNameFromMaxStat(team1Stats, ".st-adr");
    // Team 2 Highest AVG Damage per round (name, score)
    [
      data.team2_most_damage_per_round_player,
      data.team2_most_damage_per_round
    ] = await getNameFromMaxStat(team2Stats, ".st-adr");
    // Team 1 Lowest Kills (name, score)
    [
      data.team2_least_kills_player,
      data.team2_least_kills
    ] = await getNameFromMaxStat(team2Stats, ".st-kills", "min");
    // Team 2 Lowest Kills (name, score)
    [
      data.team2_least_kills_player,
      data.team2_least_kills
    ] = await getNameFromMaxStat(team2Stats, ".st-kills", "min");
    // Team 1 Lowest Assists (name, score)
    [
      data.team1_least_assists_player,
      data.team1_least_assists
    ] = await getNameFromMaxStat(team1Stats, ".st-assists", "min");
    // Team 1 Lowest Assists (name, score)
    [
      data.team2_least_assists_player,
      data.team2_least_assists
    ] = await getNameFromMaxStat(team2Stats, ".st-assists", "min");
    // Team 1 Lowest Deaths (name, score)
    [
      data.team1_least_deaths_player,
      data.team1_least_deaths
    ] = await getNameFromMaxStat(team1Stats, ".st-deaths", "min");
    // Team 2 Lowest Deaths (name, score)
    [
      data.team2_least_deaths_player,
      data.team2_least_deaths
    ] = await getNameFromMaxStat(team2Stats, ".st-deaths", "min");
    // Team 1 Lowest AVG Damage per round (name, score)
    [
      data.team1_least_damage_per_round_player,
      data.team1_least_damage_per_round
    ] = await getNameFromMaxStat(team1Stats, ".st-adr", "min");
    // Team 2 Lowest AVG Damage per round (name, score)
    [
      data.team2_least_damage_per_round_player,
      data.team2_least_damage_per_round
    ] = await getNameFromMaxStat(team2Stats, ".st-adr", "min");

    const team1Players = Array.from(
      team1Stats.querySelectorAll(".st-player")
    ).map(x => {
      return x.innerText;
    });
    const team2Players = Array.from(
      team1Stats.querySelectorAll(".st-player")
    ).map(x => {
      return x.innerText;
    });

    // returns the team of a player
    const getTeamFrom = player => {
      return team1Players.includes(player) ? data.team1 : data.team2;
    };

    const overalls = Array.from(document.querySelectorAll(".most-x-box")).map(
      x => {
        let out = x.innerText.split("\n");
        out.splice(1, 1);
        return out;
      }
    );

    // Gets overall stats for kills, adr, assists, awp kills, opening kills, rating 2.0
    //     (name, score, team)
    for (let array of overalls) {
      data["overall_" + array[1].toLowerCase().replace(" ", "_") + "_player"] =
        array[0];
      data["overall_" + array[1].toLowerCase().replace(" ", "_")] = array[2];
      data[
        "overall_" + array[1].toLowerCase().replace(" ", "_") + "_team"
      ] = await getTeamFrom(array[0]);
    }

    return data;
  });
  return result;
};

async function processUrls(urls) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const out = [];
  for (const url of urls) {
    const output = await scrape(page, url);
    out.push(output);
  }
  browser.close();
  fs.writeFile("output.csv", convertArrayToCSV(out), error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
}

processUrls(urls);
