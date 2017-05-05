import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KuxScrollComponent, KuxScrollItemDirective } from './scroll.component'
import { KuxScrollBarModule } from '../scrollbar'
@NgModule({
    imports: [
        CommonModule,
        KuxScrollBarModule
    ],
    declarations: [KuxScrollComponent, KuxScrollItemDirective],
    exports: [KuxScrollComponent,KuxScrollItemDirective]
})
export class KuxScrollModule { }