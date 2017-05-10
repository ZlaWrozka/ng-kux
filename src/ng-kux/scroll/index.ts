import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KuxScrollComponent } from './scroll.component';
import { KuxScrollItemDirective } from './scroll.directive'
import { KuxScrollBarModule } from '../scrollbar'
@NgModule({
    imports: [
        CommonModule,
        KuxScrollBarModule
    ],
    declarations: [KuxScrollComponent, KuxScrollItemDirective],
    exports: [KuxScrollComponent, KuxScrollItemDirective]
})
export class KuxScrollModule { }