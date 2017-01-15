module.exports = function() {
  var events = require("../Events/EventEmitter.js");
  events.on("CONSOLE_INPUT", function(data){
    if(data[0] == "/") {
      data = data.replace("/","").trim();
      data = data.split(" ");
      events.emit("COMMAND", data);
    }else{
      //Send to chat
    }
  });
}
