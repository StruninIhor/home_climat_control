import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ClimatData } from '../common/models/climat-data';
import * as moment from 'moment'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ClimatDataService } from '../common/services/climat-data.service';
import { ClimatDataQuery } from '../common/models/climat-data-query';

import * as signalR from "@aspnet/signalr"
import { environment } from 'src/environments/environment';
import { SensorDataChartComponent } from '../common/components/sensor-data-chart/sensor-data-chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  @ViewChildren('sensorData') sensorDatas:QueryList<SensorDataChartComponent>;

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

  private hubConnection : signalR.HubConnection;


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
     return data.map<T>(x => x[key])
   }

   processData(data : ClimatData[], current : boolean = true) {
    let temp = this.getDataForKey<number>(data, "temperature");
    let humidities = this.getDataForKey<number>(data, "humidity");
    let pressures = this.getDataForKey<number>(data, "pressure");
    if (current) {
      this.temperature = temp[temp.length - 1];
      this.humidity = humidities[humidities.length - 1];
      this.pressure = pressures[pressures.length - 1];
    }
    this.temperatures[0].data = temp;
    this.humidities[0].data = humidities;
    this.pressures[0].data = pressures;
    this.dateLabels = data.map((x,i) => moment.utc(x.date).format('HH:mm:ss'));
    this.data = data;
   }
  ngOnInit(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("http://" + environment.api.baseUrl.split('/')[2] + "/realtime-sensor", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err=> console.log('Error while starting connection: ' + err))
    let today = moment().startOf('day');
    var query : ClimatDataQuery = {
      count: void 0,
      endDate: void 0,
      startDate: today,
    };
    this.hubConnection.on('currentData', (data : ClimatData) => {
      console.log(data);
      this.humidity = data.humidity;
      this.temperature = data.temperature;
      this.pressure = data.pressure;

      // this.temperatures[0].data.push(data.temperature);
      // this.humidities[0].data.push(data.humidity);
      // this.pressures[0].data.push(data.pressure);
      // this.dateLabels.push(data.date.format('HH:mm:ss'))
      // this.sensorDatas.forEach(c => {
      //   c.updateChart();
      // })
    })
    this.dataService.getData(query).subscribe(data => {
     this.processData(data);
    })
  }


  queryData() {

  }

}
