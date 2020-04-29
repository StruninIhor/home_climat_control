using System;

namespace HomeClimatControl.Web.Domain.Entities
{
    public class SensorRecord
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public float? Humidity { get; set; }
        public float? Temperature { get; set; }
        public float? Pressure { get; set; }
    }
}
