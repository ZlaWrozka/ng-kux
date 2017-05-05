import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { routes } from './scroll.routes';
import { KuxScrollModule } from '../../ng-kux/scroll'
import { ScrollComponent } from './scroll.component';

@NgModule({
  imports: [
    CommonModule,
    KuxScrollModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScrollComponent]
})
export class ScrollModule { }