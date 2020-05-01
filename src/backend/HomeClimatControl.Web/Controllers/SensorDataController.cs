using System;
using System.Collections.Generic;
using System.Linq;
using HomeClimatControl.Web.Application.Services;
using HomeClimatControl.Web.Data;
using HomeClimatControl.Web.Domain.Entities;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public ActionResult<SensorRecord[]> Get(DateTime? startDate, DateTime? endDate, int? count)
        {
            var q = _context.SensorRecords
                .AsQueryable();
            if (startDate != null)
            {
                q = q.Where(x => x.Date > startDate);
            }
            if (endDate != null)
            {
                q = q.Where(x => x.Date < endDate);
            }
            if (count != null)
            {
                q = q.OrderByDescending(x => x.Date);
                q = q.Take(count.Value);
            }
            q = q.OrderBy(x => x.Date);
            return q.ToArray();

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
