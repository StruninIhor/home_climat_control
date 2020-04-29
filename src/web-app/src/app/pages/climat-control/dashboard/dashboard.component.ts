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
  tileColor = '#03fc52';
  humidity : number;
  temperature: number;
  pressure: number;
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
   public dateLabels : Label[] = []

   public getDataForKey<T>(data: ClimatData[], key: string) {
     return this.data.map<T>(x => x[key])
   }

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.data = data;
      let temp = this.getDataForKey<number>(data, "temperature");
      let humidities = this.getDataForKey<number>(data, "humidity");
      let pressures = this.getDataForKey<number>(data, "pressure");
      this.temperature = temp[temp.length - 1];
      this.humidity = humidities[humidities.length - 1];
      this.pressure = pressures[pressures.length - 1];
      this.temperatures[0].data = temp;
      this.humidities[0].data = humidities;
      this.pressures[0].data = pressures;
      this.dateLabels = this.data.map((x,i) => moment.utc(x.date).format('HH:mm:ss'));
    })
  }

}
