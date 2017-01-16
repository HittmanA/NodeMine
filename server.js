'use strict';

var pmp = require('pocket-minecraft-protocol');
var fs = require("fs");
var processConfig =  require("./nmps/Config/processConfig.js");
var logger = require("./nmps/Console/Console.js");
var gfs = require("./nmps/Utils/GetFileSync.js");
var io = require("./nmps/Console/IO.js");
var Io = new io();
var events = require("./nmps/Events/EventEmitter.js");
var chunk = require("./nmps/Chunk/GenerateChunk.js");
var commandParser = require("./nmps/Command/CommandParser.js");
var commandManager = require("./nmps/Command/commandManager.js");
commandManager = new commandManager();
commandParser = new commandParser();

var newChunk = chunk.generateChunk(0,0);

logger.info("Starting NMPS...");

logger.info("\n"+gfs.getFileSync("./internal/startup.txt"));
logger.info("Loading NMPS config...");

var config = processConfig.processConfig(gfs.getFileSync("./configs/nmps.conf"));

logger.info("Loaded!");

logger.info("Initializing server...");

var server = pmp.createServer({
  host: config.Host,
  port: parseInt(config.Port),
  name: 'MCPE;'+config.Name+';81 81;1.0.0;0;'+config.Slots
});

logger.info("Server online at "+config.Host+":"+config.Port);

server.on('connection', function(client) {


  client.on("mcpe",packet => console.log(packet, false));

  client.on("mcpe_login",packet => {

    if (packet.protocol !== 100) {
      if (packet.protocol > 100) {
          return client.writeMCPE('player_status', {
            status: 2
          });
        } else {
          return client.writeMCPE('player_status', {
            status: 1
          });
        }
    }

    client.writeMCPE("player_status",{
      status:0
    });

    if (packet.username == null) {
        log('A Player with null as username tried to connect!', 1);
        return client.writeMCPE('disconnect', {
            message: 'Username cannot be null'
        });
    }

    client.writeMCPE('move_player', {
      entityId: [0,0],
      x: 1,
      y: 64 + 1.62,
      z: 1,
      yaw: 0,
      headYaw: 0,
      pitch: 0,
      mode: 0,
      onGround: 1
    });

    client.writeMCPE('start_game', {
            entity_id: [0, 0],
            runtime_entity_id: [0, 0],
            x: 0, y: 5 + 1.62, z: 0,
            unknown_1: {
                x: 15,
                y: 25
            },
            seed: 12345,
            dimension: 0,
            generator: 2,
            gamemode: 1,
            difficulty: 0,

            spawn: {
                x: 0,
                y: 5 + 1.62,
                z: 0
            },

            has_achievements_disabled: true,
            day_cycle_stop_time: -1,
            edu_mode: false,

            rain_level: 0,
            lightning_level: 0,

            enable_commands: true,
            is_texturepacks_required: false,
            secret: '1m0AAMIFIgA=',
            world_name: 'world'
        });

    client.writeMCPE('set_spawn_position', {
      x: 1,
      y: 64,
      z: 1
    });
    client.writeMCPE("set_time",{
      time:0,
      started:1
    });

    client.writeMCPE('respawn', {
      x: 1,
      y: 64,
      z: 1
    });
  });

  client.on("chunk_radius_update",() => {
    client.writeMCPE('chunk_radius_update',{
      chunk_radius:1
    });

    for (let x = -1; x <=1; x++) {
      for (let z = -1; z <=1; z++) {
        client.writeBatch([{name:"full_chunk_data",params:{
          chunkX: x,
          chunkZ: z,
          order: 1,
          chunkData: newChunk
        }}]);
      }
    }
    
    client.writeMCPE('player_status', {
      status: 3
    });

    client.writeMCPE('set_time', {
      time: 0,
      started: 1
    });

  });

  client.on('error', function(err) {
    console.log(err.stack);
  });

  client.on('end',function() {
    logger.info("client left");
  })

});
