using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeClimatControl.Web.Application.Services;
using HomeClimatControl.Web.Data;
using HomeClimatControl.Web.Domain.Entities;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;

namespace HomeClimatControl.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly ClimatDbContext _context;
        private readonly ClimatDataService _dataService;
        public SensorDataController(ClimatDbContext context, ClimatDataService dataService) => (_context, _dataService) = (context, dataService);

        public class ClimatQueryModel
        {
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public int? Count { get; set; }
        }

        public IQueryable<SensorRecord> GetQuery(ClimatQueryModel model)
        {
            var source = _context.SensorRecords.AsQueryable();
            if (model.StartDate.HasValue)
            {
                source = source.Where(x => x.Date > model.StartDate.Value);
            }
            if (model.EndDate.HasValue)
            {
                source = source.Where(x => x.Date < model.EndDate);
            }
            if (model.Count.HasValue)
            {
                source = source.OrderByDescending(x => x.Date);
                source = source.Take(model.Count.Value);
            }
            return source.OrderBy(x => x.Date);
        }
 
        [HttpGet]
        public async Task<ActionResult<SensorRecord[]>> Get([FromQuery]ClimatQueryModel model)
        {
            return await GetQuery(model).ToArrayAsync(HttpContext.RequestAborted);
        }

        [HttpGet("temperatures")]
        public async Task<ActionResult<SensorRecord[]>> GetTemperatures([FromQuery]ClimatQueryModel model)
        {
            return await GetQuery(model).Select(x => new SensorRecord
            {
                Id = x.Id,
                Date = x.Date,
                Temperature = x.Temperature
            }).ToArrayAsync(HttpContext.RequestAborted);
        }

        [HttpGet("humidities")]
        public async Task<ActionResult<SensorRecord[]>> GetHumidities([FromQuery] ClimatQueryModel model)
        {
            return await GetQuery(model).Select(x => new SensorRecord
            {
                Id = x.Id,
                Date = x.Date,
                Humidity = x.Humidity
            }).ToArrayAsync(HttpContext.RequestAborted);
        }

        [HttpGet("pressures")]
        public async Task<ActionResult<SensorRecord[]>> GetPressures([FromQuery] ClimatQueryModel model)
        {
            return await GetQuery(model).Select(x => new SensorRecord
            {
                Id = x.Id,
                Date = x.Date,
                Pressure = x.Pressure 
            }).ToArrayAsync(HttpContext.RequestAborted);
        }


        [HttpPut("humidityLevel")]
        public IActionResult ConfigureHumidity([FromBody] HumididityConfigurationModel model)
        {
            try
            {
                return Ok(new { result = _dataService.ConfigureHumidityLevel(model.LowLevel, model.HighLevel)});
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("[action]")]
        public IActionResult StartMaintenance()
        {
            return Ok(new { result = _dataService.MaintenanceSwitch(false) });
        }
        [HttpPut("[action]")]
        public IActionResult EndMaintenance()
        {
            return Ok(new { result = _dataService.EndMaintenance() });
        }

    }

    public class HumididityConfigurationModel
    {
        public float LowLevel { get; set; }
        public float HighLevel { get; set; }
    }
}
