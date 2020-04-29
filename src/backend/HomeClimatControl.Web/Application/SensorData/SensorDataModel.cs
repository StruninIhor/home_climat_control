using System;

namespace HomeClimatControl.Web.Application.SensorData
{
    public class SensorDataDto
    {
        public DateTime Date { get; set; }
        public float? Humidity { get; set; }
        public float? Temperature { get; set; }
        public float? Pressure { get; set; }
    }
}
