import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from 'src/app/shared/core/base-api';
import { ClimatData } from '../models/climat-data';

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
  public getData() : Observable<ClimatData[]> {
    return this.get('sensordata');
  }

  public startMaintenance() : Observable<boolean> {
    return this.put<any>('sensordata/startmaintenance').pipe(data => {
      return data["result"];
    })
  }
}
