import { NgModule } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [],
  imports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
