import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './select.routes';
import { SelectComponent } from './select.component';
import { KuxSelectModule } from '../../ng-kux/select'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    KuxSelectModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SelectComponent]
})
export class SelectModule { }