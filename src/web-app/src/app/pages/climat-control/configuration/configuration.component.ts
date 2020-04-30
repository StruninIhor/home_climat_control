import { Component, OnInit } from '@angular/core';
import { ClimatDataService } from '../common/services/climat-data.service';
import { HumidityLevel } from '../common/models/humidity-level';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  public humidityLevel : HumidityLevel = {
    lowLevel: 30,
    highLevel: 70
  }

  constructor(private climatService : ClimatDataService) { }

  ngOnInit(): void {
    if (localStorage['humidityCache'] !== void 0) {
      this.humidityLevel = JSON.parse(localStorage.getItem('humidityCache'));
    }
  }
  
  processFunction(res : any) {
    alert(`Configured: ${res.result}`);
  }

  maintenanceOn() {
    this.climatService.startMaintenance().subscribe(res => this.processFunction(res))
  }

  maintenanceOff() {
    this.climatService.endMaitenance().subscribe(res => this.processFunction(res))
  }

  setHumidityLevels() {
    localStorage.setItem('humidityCache', JSON.stringify(this.humidityLevel))
    this.climatService.setHumidityLevels(this.humidityLevel).subscribe(res => this.processFunction(res))
  }

}
