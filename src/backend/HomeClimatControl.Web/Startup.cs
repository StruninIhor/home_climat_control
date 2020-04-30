using System;
using System.IO;
using System.Linq;
using System.Xml;
using HomeClimatControl.Web.Application.Services;
using HomeClimatControl.Web.Application.Services.ServiceOptions;
using HomeClimatControl.Web.Data;
using HomeClimatControl.Web.Domain.Entities;
using HomeClimatControl.Web.HostedServices;
using HomeClimatControl.Web.HostedServices.Options;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OData.Edm;
using OdataToEntity.ModelBuilder;
using Serilog;
using Serilog.Core;

namespace HomeClimatControl.Web
{
    public class Startup
    {
        private static object dbMigrateLock = new object();
        private static bool _isDbMigrated = false;
        public static bool IsDbMigrated
        {
           get
            {
                lock (dbMigrateLock)
                {
                    return _isDbMigrated;
                }
            }
            set
            {
                lock (dbMigrateLock)
                {
                    _isDbMigrated = value;
                }
            }
        }
        public void GenerateOdataClient()
        {
            var model = GetEdmModel();
            var generator = new OeJsonSchemaGenerator(model);
            using (var ms = new MemoryStream())
            {
                generator.Generate(ms);
                ms.Position = 0;
                File.WriteAllBytes("schemas/json_schema.json", ms.ToArray());
            }
        }


        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                GenerateOdataClient();
            }
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<SerialPortOptions>(Configuration.GetSection(nameof(SerialPortOptions)));
            services.Configure<SensorDataWorkerOptions>(Configuration.GetSection(nameof(SensorDataWorkerOptions)));
            services.AddCors(x => x.AddDefaultPolicy(p =>
            {
                p.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            }));
            services.AddScoped<ClimatDataService>();
            services.AddHostedService<SensorDataWorker>();
            services
                .AddDbContext<ClimatDbContext>(options =>
                {
                    options.UseSqlite(Configuration.GetConnectionString(nameof(ClimatDbContext)), builder => builder.MigrationsHistoryTable("EFMigrations"));
                })
                .AddControllers(mvcOptions =>
                {
                    //mvcOptions.En
                })
                .Services
                .AddOData();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            try
            {
                Log.Information("Migrating db...");
                using var scope = app.ApplicationServices.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ClimatDbContext>();
                context.Database.Migrate();
                IsDbMigrated = true;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error while migrating db");
            }
            app.UseCors();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.EnableDependencyInjection();
                endpoints.Select().Filter().OrderBy().Count().MaxTop(10);
                endpoints.MapODataRoute("odata", "odata", GetEdmModel());
            });
        }

        IEdmModel GetEdmModel()
        {
            var builder = new ODataConventionModelBuilder();
            builder.EntitySet<SensorRecord>("SensorData");
            return builder.GetEdmModel();
        }
    }
}
