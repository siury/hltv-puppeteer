const fs = require("fs");
const header = [
  "matchId",
  "tournament",
  "date",
  "map",
  "team1",
  "team2",
  "winner",
  "team1_rounds",
  "team2_rounds",
  "team1_first_half",
  "team1_second_half",
  "team2_first_half",
  "team2_second_half",
  "team1_opening_kills",
  "team2_opening_kills",
  "team1_clutches",
  "team2_clutches",
  "team1_most_kills_player",
  "team1_most_kills",
  "team2_most_kills_player",
  "team2_most_kills",
  "team1_most_assists_player",
  "team1_most_assists",
  "team2_most_assists_player",
  "team2_most_assists",
  "team1_most_deaths_player",
  "team1_most_deaths",
  "team2_most_deaths_player",
  "team2_most_deaths",
  "team1_most_damage_per_round_player",
  "team1_most_damage_per_round",
  "team2_most_damage_per_round_player",
  "team2_most_damage_per_round",
  "team2_least_kills_player",
  "team2_least_kills",
  "team1_least_assists_player",
  "team1_least_assists",
  "team2_least_assists_player",
  "team2_least_assists",
  "team1_least_deaths_player",
  "team1_least_deaths",
  "team2_least_deaths_player",
  "team2_least_deaths",
  "team1_least_damage_per_round_player",
  "team1_least_damage_per_round",
  "team2_least_damage_per_round_player",
  "team2_least_damage_per_round",
  "overall_most_kills_player",
  "overall_most_kills",
  "overall_most_kills_team",
  "overall_most_damage_player",
  "overall_most_damage",
  "overall_most_damage_team",
  "overall_most_assists_player",
  "overall_most_assists",
  "overall_most_assists_team",
  "overall_most_awp_kills_player",
  "overall_most_awp_kills",
  "overall_most_awp_kills_team",
  "overall_most_first_kills_player",
  "overall_most_first_kills",
  "overall_most_first_kills_team",
  "overall_best_rating_2.0_player",
  "overall_best_rating_2.0",
  "overall_best_rating_2.0_team"
];

fs.readFile("matches.csv", "utf-8", (err, matches) => {
  if (err) throw err;
  let allMatches = matches.split("\n");
  allMatches.unshift(header.join(","));
  fs.writeFile("matches.csv", allMatches.join("\n"), error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});