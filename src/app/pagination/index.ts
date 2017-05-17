import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './pagination.routes';
import { KuxPaginationModule } from '../../ng-kux/pagination'
import { PaginationComponent } from './pagination.component';

@NgModule({
  imports: [
    CommonModule,
    KuxPaginationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaginationComponent]
})
export class PaginationModule { }