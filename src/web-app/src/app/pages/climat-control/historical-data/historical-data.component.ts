import { Component, OnInit, ViewChild } from '@angular/core';
import { ClimatDataQuery, HistoricalDataQuery } from '../common/models/climat-data-query';
import { now } from 'moment';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ClimatDataService } from '../common/services/climat-data.service';
import { BaseComponent } from 'src/app/shared/core/base-component';
import { of, forkJoin, from } from 'rxjs';
import { map, mergeAll, delay } from 'rxjs/operators';
import { ClimatData } from '../common/models/climat-data';
import { ChartOptions, ChartDataSets, ChartPoint } from 'chart.js';
import { Color, Label } from 'ng2-charts';


@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss']
})

export class HistoricalDataComponent extends BaseComponent implements OnInit {
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
  dataToGather = [
    "humidity",
    "temperature",
    "pressure"
  ]

  gatheredData = {
    "humidity" : undefined,
    "temperature" : undefined,
    "pressure" : undefined
  }

  dataToDisplay : { [type: string] : ChartDataSets[] } = {
    "humidity" : [ {
      label: "Humidity",
      data: undefined }]  ,
    "temperature" : [{
        label: "Temperature",
        data: undefined }],
    "pressure" : [{
      label: "Pressure",
      data: undefined }]
  }

  public dateLabels : Label[] = []
  query : HistoricalDataQuery =  {
    startDate: moment().startOf('day'),
    count: undefined,
    endDate: moment(),
    dataToGather: []
  }
  public getDataForKey<T>(data: ClimatData[], key: string) {
    return data.map<T>(x => x[key])
  }

  constructor(private dataService : ClimatDataService) {
    super();
  }
  dataLoading : boolean = false;
  ngOnInit(): void {
  
  }
  queryData(form: NgForm) {
    this.dataLoading = true;
    let counter = 0;
    this.gatheredData = {
      "humidity" : undefined,
      "temperature" : undefined,
      "pressure" : undefined
    }
    this.dataToDisplay = {
      "humidity" : [ {
        label: "Humidity",
        data: undefined }]  ,
      "temperature" : [{
          label: "Temperature",
          data: undefined }],
      "pressure" : [{
        label: "Pressure",
        data: undefined }]
    }
    from(this.query.dataToGather)
    .pipe(map((data : string) => {
      return {
        type: data,
        gathered: this.dataService.getHistoricalData(data, this.query)
      }
    }))
    .subscribe(data => data.gathered.subscribe(gathered => {
      this.gatheredData[data.type] = gathered;
      this.dataToDisplay[data.type][0].data = this.getDataForKey<number>(gathered, data.type);
      this.dateLabels = gathered.map((x,i) => moment.utc(x.date).format('ddd HH:mm:ss'));
      counter++;
      this.dataLoading = !(counter == this.query.dataToGather.length);
    }))
  }


  mean(arr : any) {
    return arr.reduce((a,b) => a+b, 0) / arr.length;
  }

  max(arr: any) {
    return Math.max(...arr);
  }

  min(arr: any) {
    return Math.min(...arr);
  }
}
