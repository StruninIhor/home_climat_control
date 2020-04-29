using HomeClimatControl.Web.Application.SensorData;
using HomeClimatControl.Web.Application.Services.ServiceOptions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO.Ports;

namespace HomeClimatControl.Web.Application.Services
{

    public class ClimatDataService
    {
        private readonly SerialPortOptions _options;
        private readonly ILogger<ClimatDataService> _logger;
        public ClimatDataService(IOptionsSnapshot<SerialPortOptions> options, ILogger<ClimatDataService> logger) => 
           (_options, _logger) = (options?.Value ?? throw new ArgumentNullException(nameof(options)), logger);

        class SensorDataItem
        {
            public float? H { get; set; }
            public float? T { get; set; }
            public float? P { get; set; }
        }
        private static readonly object portLock = new object();
        private SerialPort CreatePort()
        {
            return new SerialPort
            {
                PortName = _options.SerialPortName,
                BaudRate = _options.BaudRate
            };
        }

    public SensorDataDto GetCurrentData()
        {
            
            string data;
            lock (portLock)
            {
                using var port = CreatePort();
                port.Open();
                data = port.ReadLine();
                port.Close();
            }
            var counter = 0;
            while (counter < _options.OkRetryCount)
            {
                try
                {
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
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error while reading data from sensor!");
                    System.Threading.Thread.Sleep(TimeSpan.FromSeconds(1));
                }
            }
            return null;
        }

        private bool SendCommand(string command)
        {
            var applied = false;
            lock (portLock)
            {
                using var port = CreatePort();
                port.Open();
                port.Write(command);
                var counter = 0;
                while (counter++ < _options.OkRetryCount)
                {
                    _logger.LogInformation("Waiting for OK response");
                    var data = port.ReadLine();
                    if (data.Contains("OK"))
                    {
                        _logger.LogInformation("OK received");
                        applied = true;
                        break;
                    }
                }
                port.Close();
            }
            return applied;
        }
        public bool ConfigureHumidityLevel(float lowLevel, float highLevel)
        {
            bool levelValid(float val) => val < 100 & val > 0;
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
