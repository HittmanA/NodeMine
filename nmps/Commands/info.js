var processConfig =  require("../Config/processConfig.js");
var logger = require("../Console/Console.js");

var config = processConfig.processConfig(gfs.getFileSync("./configs/nmps.conf"));
logger.info("====================");
logger.info("Server info:");
logger.info("Name: "+config.Name);
logger.info("Host: "+config.Host);
logger.info("Port: "+config.Port);
logger.info("Slots: "+config.Slots);
logger.info("====================");
