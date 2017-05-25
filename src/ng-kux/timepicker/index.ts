import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KuxTimepickerComponent, kuxDataFormat2, kuxTimepickerBtn } from './timepicker.component';
import { UtilService } from '../utils/util'
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [UtilService],
  declarations: [kuxDataFormat2, KuxTimepickerComponent, kuxTimepickerBtn],
  exports: [KuxTimepickerComponent]
})
export class KuxTimepickerModule { }