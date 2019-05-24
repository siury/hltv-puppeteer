const fs = require("fs");
let header =
  "name,origin,map,date,matchId,tournament,team,against,kills,headshots,assists,hit_flashbangs,deaths,kast,adr,opening_kills,opening_deaths,rating";

fs.readFile("players.csv", "utf-8", (err, data) => {
  if (err) throw err;
  let allPlayers = data.split("\n");
  allPlayers.unshift(header);
  fs.writeFile("players.csv", allPlayers.join("\n"), error => {
    error === null ? console.log("Success") : console.log("Error" + error);
  });
});
