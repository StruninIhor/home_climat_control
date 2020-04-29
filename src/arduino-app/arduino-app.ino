#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define DEBUG false

#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10

//#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme; // I2C
//Adafruit_BME280 bme(BME_CS); // hardware SPI
//Adafruit_BME280 bme(BME_CS, BME_MOSI, BME_MISO, BME_SCK); // software SPI

#define LOW_HUMIDITY_LEVEL 30
#define HIGH_HUMIDITY_LEVEL 60
#define CONTROL_PIN 13
uint32_t delayTime = 3000u;
bool state = false;
bool maintenance = false;
float lowHumidityLevel = LOW_HUMIDITY_LEVEL;
float highHumidityLevel = HIGH_HUMIDITY_LEVEL;
void setup() {
    //Setup control pin for humidifier
    pinMode(CONTROL_PIN, OUTPUT);
    Serial.begin(9600);
    while(!Serial) delay(1);    // time to get serial running
    
    // You can also pass in a Wire library object like &Wire2
    // status = bme.begin(0x76, &Wire2)
    while (setupSensor()) {
      delay(100);
    }
}

bool setupSensor() {
  unsigned status;
  // default settings
  status = bme.begin();
  if (!status) {
     Serial.print("ERROR. Sensor id: 0x");
     Serial.println(bme.sensorID(),16);
  }
  return !status;
}

//stores current time after start
uint32_t timer = 0u;

void loop() { 
    if (Serial.available() > 0) {
          processSettings();
        }
    if (millis() - timer >= delayTime) {
      timer = millis();
      mainFunc();
    }
    else delay(10);
}

String translateFloat(float value) {
  return isnan(value) ? "null" : String(value); 
}

void mainFunc() {
  float temp = bme.readTemperature();
  float pressure = bme.readPressure() / 100.0F;
  float humidity = bme.readHumidity();
  
  Serial.print("{\"T\": ");
  Serial.print(translateFloat(temp));
  Serial.print(",\"P\": ");
  Serial.print(translateFloat(pressure));
  Serial.print(",\"H\": ");
  Serial.print(translateFloat(humidity));
  Serial.print('}');
  Serial.println();
  if (DEBUG) {
    Serial.println("Low humidity level " + String(lowHumidityLevel) + "; High " + String(highHumidityLevel));
    Serial.println("Maintenance: " + String(maintenance));
  }
  if (humidity > highHumidityLevel) {
    switchHumidifier(false, false);
  }
  else if (humidity < lowHumidityLevel) {
   switchHumidifier(true, false);
  }
}

void switchHumidifier(bool switchState, bool hard) {
  
  if (state != switchState && (!maintenance || hard)) {
    digitalWrite(CONTROL_PIN, state ? LOW : HIGH);
    state = switchState;
  }
  //Serial.print("Serial state: ");
  //Serial.println(state ? "ON" : "OFF");
}

void processSettings()  {
  String command = Serial.readString();
  if (DEBUG) {
    Serial.println("RECEIVED " + command);
  }
  bool ok = false;
  if (command.startsWith("SETTINGS BEGIN ")) {
    int separatorIndex = command.indexOf(';');
    //15 - length of "SETTINGS BEGIN "
    String humidityLow = command.substring(15, separatorIndex);
    String humidityHigh = command.substring(separatorIndex+1, command.length());
    if (DEBUG) {
      Serial.println("PARSED: LOW " + humidityLow + "; HIGH: " + humidityHigh);
    }
    lowHumidityLevel = humidityLow.toFloat();
    highHumidityLevel = humidityHigh.toFloat();
    if (isnan(lowHumidityLevel) || isnan(highHumidityLevel)) {
      Serial.println("ERROR: One level is NaN!");
    }
    ok = true;
  }
  else if (command.startsWith("DEVICE ")) {
    if (command.startsWith("DEVICE ON")) {
      switchHumidifier(true, true);
      maintenance = ok = true;
    }
    else if (command.startsWith("DEVICE OFF")) {
      switchHumidifier(false, true);
      maintenance = ok = true;
    }
  }
  else if (command.startsWith("MAINTENANCE OFF")) {
    maintenance = false;
    ok = true;
  }
  if (ok) Serial.println("OK");
}
