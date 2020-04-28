import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartType, ChartPluginsOptions, } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-sensor-data-chart',
  templateUrl: './sensor-data-chart.component.html',
  styleUrls: ['./sensor-data-chart.component.scss']
})
export class SensorDataChartComponent implements OnInit {


  @Input('datasets')
  public datasets : ChartDataSets[] = []
  @Input('labels')
  public labels : Label[] = []
  @Input('colors')
  colors: Color[] = [];
  @Input('showLegend')
  showLegend  = true;

  private createScalesIfUndefined() {
    if (this.lineChartOptions.scales == void 0) {
      this.lineChartOptions.scales = {
        yAxes: [],
        xAxes: [],
        gridLines: {

        }
      }
    }
  }
  private updateScales() {
    this.lineChartOptions.scales.yAxes = [
      {
        ticks: {
          min: this._minY,
          max: this._maxY
        }
      }
    ]
  }
  private _minY : number = void 0;
  private _maxY : number = void 0;

  @Input('min-y')
  public set minY(value: number) {
    this.createScalesIfUndefined()
    this._minY = value;
    this.updateScales()
  }
  @Input('max-y')
  public set maxY(value: number) {
    this.createScalesIfUndefined()
    this._maxY = value;
    this.updateScales()
  }

  lineChartPlugins = [];
  lineChartType = 'line';

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
  

  

 

   public dateLabels() : Label[] {
     return [1, 2, 3, 4, 5, 6, 7, 8].map(x => x.toString())
   }

  public chartType: ChartType = 'line'

  public chartPlugins = []
  constructor() { }

  ngOnInit(): void {
  }

}
