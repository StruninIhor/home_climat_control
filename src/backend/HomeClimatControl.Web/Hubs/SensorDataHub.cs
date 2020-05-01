using HomeClimatControl.Web.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeClimatControl.Web.Hubs
{
    public class SensorDataHub : Hub
    {
        public async Task CurrentData(SensorRecord record)
        {
            await this.Clients.All.SendAsync(nameof(CurrentData), record);
        }
    }
}
