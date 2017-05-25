import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './timepicker.routes';
import { KuxTimepickerModule } from '../../ng-kux/timepicker'
import { TimepickerComponent } from './timepicker.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    KuxTimepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TimepickerComponent]
})
export class TimepickerModule { }