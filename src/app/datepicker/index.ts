import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './datepicker.routes';
import { DatepickerComponent } from './datepicker.component';
import { KuxDatepickerModule } from '../../ng-kux/datepicker'

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    KuxDatepickerModule
  ],
  declarations: [DatepickerComponent]
})
export class DatepickerModule { }