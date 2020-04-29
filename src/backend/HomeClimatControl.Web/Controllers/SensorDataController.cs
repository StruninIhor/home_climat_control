using System;
using System.Collections.Generic;
using HomeClimatControl.Web.Application.Services;
using HomeClimatControl.Web.Data;
using HomeClimatControl.Web.Domain.Entities;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;

namespace HomeClimatControl.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly ClimatDbContext _context;
        private readonly ClimatDataService _dataService;
        public SensorDataController(ClimatDbContext context, ClimatDataService dataService) => (_context, _dataService) = (context, dataService);

        [EnableQuery]
        public IEnumerable<SensorRecord> Get() => _context.SensorRecords;

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
