console.log("Script is RUN!");
const mqtt = require("mqtt");
const host = "m3.wqtt.ru";
const port = "9309";
const connectUrl = `mqtt://${host}:${port}`;
const fs=require("fs");
var tempRoom;
var obj;
var data;

exports.mq = () => {
  const client = mqtt.connect(connectUrl, {
    clean: true,
    connectTimeout: 4000,
    username: "u_186R0P",
    password: "sQy8V42P",
    reconnectPeriod: 1000,
  });

  Error.stackTraceLimit = 10;
  const topic = "base/state/temperature_room";
  client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`);

      client.on("message", (topic, payload) => {
        tempRoom = payload.toString();
        console.log("Temp room from module", +tempRoom);

        data={
          room: tempRoom, 
          hot: "wait"
        };

        data=JSON.stringify(data);
        fs.writeFile('/home/a0888254/domains/a0888254.xsph.ru/public_html/myapp/lib/data.json', data, (err) => {
          if (err) {
            console.error(err)
            return
          }
          console.log("File is writed!)");
        })
      });

      // if(Error){
      //     console.log(Error)
      // }
    });
  });
};


