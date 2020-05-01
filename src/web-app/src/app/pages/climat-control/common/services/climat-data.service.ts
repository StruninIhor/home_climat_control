import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  private getDataForRoute(route : string, query: ClimatDataQuery) : Observable<ClimatData[]> {
    let params = new HttpParams();
    if (query != void 0) {
      if (query.count) {
        params = params.set('count', query.count.toString());
      }
      if (query.startDate) {
        params = params.set('startDate', query.startDate.toISOString());
      }
      if (query.endDate) {
        params = params.set('endDate', query.endDate.toISOString());
      }
    }
    return this.get(route, params);
  } 

  /**
   * getTemperatures
   */
  public getData(query : ClimatDataQuery = void 0) : Observable<ClimatData[]> {
    return this.getDataForRoute('sensordata', query);
  }

  public getHistoricalData(type : string, query: ClimatDataQuery) : Observable<ClimatData[]> {
    return this.getDataForRoute(`sensordata/${type}`, query);
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
