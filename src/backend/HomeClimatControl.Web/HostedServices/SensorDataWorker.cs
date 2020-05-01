using HomeClimatControl.Web.Application.Services;
using HomeClimatControl.Web.Data;
using HomeClimatControl.Web.Domain.Entities;
using HomeClimatControl.Web.HostedServices.Options;
using HomeClimatControl.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace HomeClimatControl.Web.HostedServices
{
    public class SensorDataWorker : IHostedService, IDisposable
    {
        private readonly ILogger<SensorDataWorker> _logger;
        private readonly IServiceProvider _services;
        private readonly SensorDataWorkerOptions _options;
        private Timer _timer;
        public SensorDataWorker(IServiceProvider services, ILogger<SensorDataWorker> logger, IOptions<SensorDataWorkerOptions> options) =>
            (_logger, _services, _options) = (logger, services, options?.Value ?? throw new ArgumentNullException(nameof(options)));

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Sensor data worker is starting");
            _logger.LogInformation("Worker will execute each {secondsDelay}", _options.SecondsDelay);
            _timer = new Timer(CollectData, null, TimeSpan.Zero, TimeSpan.FromSeconds(_options.SecondsDelay));
            return Task.CompletedTask;
        }

        private void CollectData(object state)
        {
            if (!Startup.IsDbMigrated)
            {
                _logger.LogInformation("DB is not migrated, waiting until next execution");
                return;
            }
            using var scope = _services.CreateScope();
            var climatService = scope.ServiceProvider.GetService<ClimatDataService>();
            var data = climatService.GetCurrentData();
            _logger.LogInformation("Got information from sensor: {0}", JsonConvert.SerializeObject(data, Formatting.Indented));
            var hubContext = scope.ServiceProvider.GetService<IHubContext<SensorDataHub>>();
            //var data = new Application.SensorData.SensorDataDto { };
            var record = new SensorRecord
            {
                Date = data?.Date ?? DateTime.Now,
                Humidity = data?.Humidity ?? 0,
                Pressure = data?.Pressure ?? 0,
                Temperature = data?.Temperature ?? 0
            };
            hubContext.Clients.All.SendAsync(nameof(SensorDataHub.CurrentData), record).Wait();
            var context = scope.ServiceProvider.GetService<ClimatDbContext>();
            context.SensorRecords.Add(
                record
               );
            context.SaveChanges();
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Sensor data worker is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
