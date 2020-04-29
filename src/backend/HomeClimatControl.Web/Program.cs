using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace HomeClimatControl.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .WriteTo.Console()
                    .WriteTo.RollingFile("logs/climat_control.log")
                    .CreateLogger();
            try
            {
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Fatal error during application start");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var config = new ConfigurationBuilder()
                   .AddJsonFile(path: "appsettings.json", optional: false, reloadOnChange: true)
                   .AddCommandLine(args)
                   .AddEnvironmentVariables()
                   .Build();
            return Host.CreateDefaultBuilder(args)
                  .UseSerilog()
                  .UseSystemd()
                  .ConfigureWebHostDefaults(webBuilder =>
                  {
                      webBuilder
                      .UseConfiguration(config)
                      .UseStartup<Startup>();
                  });
        }
    }
}
