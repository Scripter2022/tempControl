#include <OneWire.h>
#include <DallasTemperature.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <Ethernet.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
//char server[] = "192.168.3.1";

#define ONE_WIRE_BUS 5
#define MSG_BUFFER_SIZE (3)
#define aref_voltage 3.3 

const char *mqttBroker = "m3.wqtt.ru";
const int mqttPort = 9309;
const char *publishTopicHot = "base/state/temperature_hot";
const char *publishTopicRoom = "base/state/temperature_room";
const char *subscribeTopic = "led";

EthernetClient clientEther;
PubSubClient client(clientEther);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensor(&oneWire);


unsigned long lastMsg = 1;


char msg[MSG_BUFFER_SIZE];
char msgRoom[MSG_BUFFER_SIZE];

int sensorPin=0;
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "mqtt-stress7438-anfy4w";
    // Attempt to connect
    if (client.connect(clientId.c_str(), "ваш логин", "ваш пароль")) {
      Serial.println("connected");
      // Subscribe to topic
      client.subscribe(subscribeTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String message;
  for (int i = 0; i < length; i++) {
    Serial.print(message += (char)payload[i]);
  }
  Serial.println();
}
void setup() {   

  analogReference(EXTERNAL);

  sensor.begin();
  sensor.setResolution(12);

  Serial.begin(9600);
  while (!Serial) {
    ;  //ждем завершения инициализации
  }
  if (Ethernet.begin(mac) == 0) {
    Serial.println("не удалось настроить Ethernet");
    while (true) {
      delay(1);
    }
  }
  Serial.println("Connection is established");
  delay(1000);
  client.setServer(mqttBroker, mqttPort);
  client.setCallback(callback);
}
void loop() {

int reading = analogRead(sensorPin);

int temperatureRoom;

sensor.requestTemperatures();

temperatureRoom=sensor.getTempCByIndex(0);

float voltage = reading * aref_voltage;
    voltage /= 1024.0;
    // выводим напряжение
    //Serial.print(voltage); Serial.println(" volts");
    // теперь выводим температуру
    int temperatureC = (voltage - 0.5) * 100 ; //исходя из 10 мВ на градус со смещением 500 мВ
    //Serial.print(temperatureC); Serial.println(" degrees C");
    // в фаренгейтах
    delay(5000); //ждем секунду

  // Listen for mqtt message and reconnect if disconnected
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // publish message after certain time.
  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    snprintf(msg, MSG_BUFFER_SIZE, "%d", temperatureC);
    Serial.print("Publish message Hot: ");
    Serial.println(msg);
    client.publish(publishTopicHot, msg);
    snprintf(msgRoom, MSG_BUFFER_SIZE, "%d", temperatureRoom);
    Serial.print("Publish message Room: ");
    Serial.println(msgRoom);
    client.publish(publishTopicRoom, msgRoom);
  }
}
