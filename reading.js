const fs = require("fs");

fs.readFile("things.txt", "utf8", function(err, data) {
  if (err) throw err;
  console.log(data.split("\n"));
});
