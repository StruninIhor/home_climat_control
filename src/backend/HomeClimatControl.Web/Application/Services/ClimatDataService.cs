using HomeClimatControl.Web.Application.SensorData;
using HomeClimatControl.Web.Application.Services.ServiceOptions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO.Ports;
using System.Linq;

namespace HomeClimatControl.Web.Application.Services
{

    public class ClimatDataService
    {
        private readonly SerialPortOptions _options;
        private readonly ILogger<ClimatDataService> _logger;
        public ClimatDataService(IOptionsSnapshot<SerialPortOptions> options, ILogger<ClimatDataService> logger) 
        {
            (_options, _logger) = (options?.Value ?? throw new ArgumentNullException(nameof(options)), logger);
        }

        class SensorDataItem
        {
            public float? H { get; set; }
            public float? T { get; set; }
            public float? P { get; set; }
        }
        private static readonly object portLock = new object();
        private SerialPort CreatePort() => new SerialPort
            {
                PortName = _options.SerialPortName,
                BaudRate = _options.BaudRate
            };

        private void ExecuteWithPort(Action<SerialPort> action)
        {
           
            try
            {
                lock (portLock)
                {
                    using var port = CreatePort();
                    port.Open();
                    action(port);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error while executing action with sensor!");
            }
        }

    public SensorDataDto GetCurrentData()
        {
            string data = null;
            var counter = 0;
            while (counter < _options.OkRetryCount)
            {
                bool validJson = false;
                while (!validJson)
                {
                    ExecuteWithPort(port =>
                    {
                        data = port.ReadLine();
                        _logger.LogInformation($"Received data: \n\t{data}");
                        //Simple json validation, to make sure data is valid
                        validJson = data.Count(x => x == '{') == 1 && data.Count(x => x == '}') == 1 && data.Count(x => x == ',') == 2 && data.Count(x => x == '\"') == 6 && data.Count(x => x == '.') == 3;
                        _logger.LogInformation("Data is valid: {dataIsValid}", validJson);
                    });
                }
                var item = Newtonsoft.Json.JsonConvert.DeserializeObject<SensorDataItem>(data);
                if (item != null)
                {
                    return new SensorDataDto
                    {
                        Date = DateTime.Now,
                        Humidity = item.H,
                        Pressure = item.P,
                        Temperature = item.T
                    };
                }
            }
            return null;
        }

        private bool SendCommand(string command)
        {
            var applied = false;
            ExecuteWithPort(port =>
            {
                _logger.LogInformation("Sending command {command}", command);
                port.Write(command);
                var counter = 0;
                while (counter++ < _options.OkRetryCount)
                {
                    _logger.LogInformation("Waiting for OK response");
                    var data = port.ReadLine();
                    _logger.LogInformation("Received response from serial port {response}", data);
                    if (data.Contains("OK"))
                    {
                        _logger.LogInformation("OK received");
                        applied = true;
                        break;
                    }
                }
            });
            return applied;
        }
        public bool ConfigureHumidityLevel(float lowLevel, float highLevel)
        {
            static bool levelValid(float val) => val < 100 & val > 0;
            if (!levelValid(lowLevel)) throw new Exception("Low level should be between 0 and 100!");
            if (!levelValid(highLevel)) throw new Exception("Low level should be between 0 and 100!");
            if (lowLevel >= highLevel)
            {
                throw new Exception("High level should be greater than low level");
            }
            var applied = SendCommand($"SETTINGS BEGIN {lowLevel};{highLevel}");
            if (applied)
            {
                _logger.LogInformation("Humidity configuration changed: LOW: {humidityLowLevel}, HIGH: {humidityHighLevel}", lowLevel, highLevel);
            } 
            else
            {
                _logger.LogWarning("Humidity config was not applied or response was not got from arduino!");
            }
            return applied;
        }

        public bool MaintenanceSwitch(bool state)
        {
            var applied = SendCommand("DEVICE " + (state ? "ON" : "OFF"));
            if (applied)
            {
                _logger.LogInformation("Manually switched " + (state ? "on" : "off") + "device");
            }
            else
            {
                _logger.LogWarning("Manual switch failed!");
            }
            return applied;
        }

        public bool EndMaintenance()
        {
            return SendCommand("MAINTENANCE OFF");
        }
    }

}
