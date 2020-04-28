import { NgModule } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [],
  imports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule
  ],
  exports: [
    MatExpansionModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule
  ]
})
export class MaterialModule { }
