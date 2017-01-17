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

var newChunk = chunk.generateChunk();

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

    client.writeMCPE('resource_packs_info', {
            mustAccept: false,
            behahaviorpackinfos: 0,
            resourcepackinfos: 0
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
            world_name: 'temp_server'
        });
        client.writeMCPE('set_time', {
            time: 0,
            started: true
        });
        client.writeMCPE('adventure_settings', {
            flags: 0x040,
            user_permission: 3
        });
        client.writeMCPE('player_status', {
            status: 3
        });
        client.on('request_chunk_radius', (packet) => {
          console.log(packet);
          client.writeMCPE('chunk_radius_update', {
              chunk_radius: 22
          });
          return;

          for (let x = -2; x <= 2; x++) {
              for (let z = -2; z <= 2; z++) {
                  player.client.writeBatch([{name: 'full_chunk_data', params: {
                      chunk_x: x,
                      chunk_z: z,
                      chunk_data: newChunk
                  }}]);
              }
          }
          //return;

          client.writeMCPE('respawn', {
              x: 0,
              y: 25,
              z: 0
          });
          client.writeMCPE('player_status', {
              status: 3
          });
      });
    });

  });
