import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './scrollBar.routes';
import { KuxScrollBarModule } from '../../ng-kux/scrollbar'
import { ScrollBarComponent } from './scrollBar.component';

@NgModule({
  imports: [
    CommonModule,
    KuxScrollBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScrollBarComponent],
  exports:[ScrollBarComponent]
})
export class ScrollBarModule { }