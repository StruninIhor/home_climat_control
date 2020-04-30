import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from 'src/app/shared/core/base-api';
import { ClimatData } from '../models/climat-data';
import { HumidityLevel } from '../models/humidity-level';
import { ClimatDataQuery } from '../models/climat-data-query';

@Injectable({
  providedIn: 'root'
})
export class ClimatDataService extends BaseApi {

  

  constructor(protected http: HttpClient) { 
    super(http)
  }

  /**
   * getTemperatures
   */
  public getData(query : ClimatDataQuery = void 0) : Observable<ClimatData[]> {
    let queryString = 'sensordata';
    if (query != void 0) {
      queryString += `?count=${query.count}`;
      if (query.startDate) {
        queryString += `&startDate=${query.startDate}`
      }
      if (query.endDate) {
        queryString += `&endDate=${query.endDate}`
      }
    }
    return this.get(queryString);
  }

  public startMaintenance() : Observable<any> {
    return this.put<any>('sensordata/startmaintenance');
  }

  public endMaitenance() : Observable<any> {
    return this.put<any>('sensordata/endmaintenance');
  }

  public setHumidityLevels(humidityLevel : HumidityLevel) : Observable<any> {
    return this.put<HumidityLevel>('sensordata/humidityLevel', humidityLevel);
  }
}
