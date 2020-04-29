namespace HomeClimatControl.Web.Application.Services.ServiceOptions
{
    public class SerialPortOptions
    {
        public string SerialPortName { get; set; }
        public int BaudRate { get; set; }
        public int OkRetryCount { get; set; } = 3;
    }
}
