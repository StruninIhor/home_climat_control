import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/climat-control/dashboard/dashboard.component';
import { ConfigurationComponent } from './pages/climat-control/configuration/configuration.component';
import { HistoricalDataComponent } from './pages/climat-control/historical-data/historical-data.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'historical-data', component: HistoricalDataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
