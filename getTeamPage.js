const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

const teamname = "liquid";
nightmare
  .goto(`https://www.hltv.org/search?query=${teamname}`)
  .wait(".table")
  .evaluate(() => document.querySelector(".team-logo").parentNode.href)
  .end()
  .then(console.log)
  .catch(error => {
    console.error("Search failed:", error);
  });
