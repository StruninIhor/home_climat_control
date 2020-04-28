import { Component, OnInit } from '@angular/core';
import { ClimatData } from '../common/models/climat-data';
import * as moment from 'moment'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ClimatDataService } from '../common/services/climat-data.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lineChartOptions : ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    // scales: {
    //   yAxes: [
    //     {
    //       ticks: {
    //         max: 20,
    //         min: 10
    //       }
    //     }
    //   ]
    // }
  };
  lineChartColors: Color[] = [
    {
      borderColor: '#09b8e8',
      backgroundColor: 'transparent',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  public data : ClimatData[];
  constructor(private dataService : ClimatDataService) {

   }

  public temperatures : ChartDataSets[] = [
  {
    label: 'Temperature'
  }]
  public humidities : ChartDataSets[] = [
    {
      label: 'Humidity'
    }]
  public pressures : ChartDataSets[] = [
    {
      label: 'Pressure'
    }] 
   public dateLabels() : Label[] {
     return this.data.map((x,i) => moment.utc(x.dateTime).format('HH:mm:ss'))
   }

   public getDataForKey<T>(data: ClimatData[], key: string) {
     return this.data.map<T>(x => x[key])
   }

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.data = data;
      this.temperatures[0].data = this.getDataForKey<number>(data, "temperature")
      this.humidities[0].data = this.getDataForKey<number>(data, "humidity")
      this.pressures[0].data = this.getDataForKey<number>(data, "pressure")
    })
  }

}
