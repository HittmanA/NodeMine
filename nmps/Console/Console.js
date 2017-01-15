var log = console.log;
console.log = function(message, logtrue) {
  if(logtrue === false || logtrue == undefined) {
    log(message);
  }else{
    var timestamp = require("../Time/Time.js");
    log("[" + timestamp.getTimestamp() + "][INFO] " + message);
  }
}

module.exports = {
  info: function(message) {
    var timestamp = require("../Time/Time.js");
    console.log("[" + timestamp.getTimestamp() + "][INFO] " + message);
  },

  warning: function(message) {
    var timestamp = require("../Time/Time.js");
    console.log("[" + timestamp.getTimestamp() + "][WARNING] " + message);
  },

  critical: function(message) {
    var timestamp = require("../Time/Time.js");
    console.log("[" + timestamp.getTimestamp() + "][CRITICAL] " + message);
  },

  error: function(message) {
    var timestamp = require("../Time/Time.js");
    console.log("[" + timestamp.getTimestamp() + "][ERROR] " + message);
  }
}
