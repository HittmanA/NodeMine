var commands = require("../Data/commands.json");

var logger = require("../Console/Console.js");

for(i in commands) {
  logger.info("/" + i + ":\n\t\t  " + commands[i]["help"] + "\n\t\t  " + commands[i]["role"]);
}
