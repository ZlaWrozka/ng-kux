import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KuxDatepickerComponent, KuxDatepickerPanelComponent, kuxDataFormat, kuxDatepickerBtn } from './datepicker.component';
import { KuxDatepickerPanelService } from './KuxDatepickerPanel.service';
import { KuxDatepickerFormServiceService } from './KuxDatepickerForm.service'
import { UtilService } from '../utils/util'
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [KuxDatepickerPanelService, KuxDatepickerFormServiceService, UtilService],
  declarations: [KuxDatepickerComponent, KuxDatepickerPanelComponent, kuxDataFormat, kuxDatepickerBtn],
  exports: [KuxDatepickerPanelComponent, KuxDatepickerComponent, kuxDataFormat]
})
export class KuxDatepickerModule { }