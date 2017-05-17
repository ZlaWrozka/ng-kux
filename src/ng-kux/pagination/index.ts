import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KuxPaginationComponent } from './pagination.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [KuxPaginationComponent],
    exports: [KuxPaginationComponent]
})
export class KuxPaginationModule { }