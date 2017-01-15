module.exports = function() {
  var events = require("../Events/EventEmitter.js");
  var logger = require("../Console/Console.js");
  var commands = require("../Data/commands.json");
  var gfs = require("../Utils/GetFileSync.js");

  events.on("COMMAND", function(data){
    if(commands[data[0]] != null || commands[data[0]] != undefined) {
      var command = data[0];
      if(commands[command]["return"] == "#ROOT#") {
        eval(gfs.getFileSync("./nmps/Commands/"+command+".js"));
      }else{

      }
    }else{
      logger.error("COMMAND_NOT_FOUND", data);
    }
  });
}
