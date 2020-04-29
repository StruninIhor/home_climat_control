using HomeClimatControl.Web.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HomeClimatControl.Web.Data
{
    public class ClimatDbContext : DbContext
    {
        public ClimatDbContext(DbContextOptions<ClimatDbContext> options)
            : base (options)
        {

        }
        public DbSet<SensorRecord> SensorRecords { get; set; }
    }
}
