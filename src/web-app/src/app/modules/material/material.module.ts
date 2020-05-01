import { NgModule } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
//import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';



@NgModule({
  declarations: [],
  imports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    //MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    //MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class MaterialModule { }
