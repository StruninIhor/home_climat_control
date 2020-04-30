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
import { ConfigurationComponent } from './pages/climat-control/configuration/configuration.component';
import { FormsModule } from '@angular/forms';
import { MaxValidatorDirective } from './shared/directives/max-validator.directive';
import { MinValidatorDirective } from './shared/directives/min-validator.directive';
import { HistoricalDataComponent } from './pages/climat-control/historical-data/historical-data.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SensorDataChartComponent,
    ConfigurationComponent,
    MaxValidatorDirective,
    MinValidatorDirective,
    HistoricalDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ChartsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
