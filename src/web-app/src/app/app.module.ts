import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/climat-control/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts'
import { HttpClientModule } from '@angular/common/http';
import { SensorDataChartComponent } from './pages/climat-control/common/components/sensor-data-chart/sensor-data-chart.component';
import { MaterialModule } from './modules/material/material.module';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SensorDataChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
