import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KuxScrollbarComponent, kuxScrollbarContent } from './scrollbar.component';
import { kuxScrollingDirective, kuxDrag } from './scrollbar.directive'
import { KuxScrollHelper } from './helper'
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [KuxScrollHelper],
  declarations: [
    KuxScrollbarComponent,
    kuxScrollbarContent,
    kuxScrollingDirective,
    kuxDrag
  ],
  exports: [
    KuxScrollbarComponent
  ]
})
export class KuxScrollBarModule { }