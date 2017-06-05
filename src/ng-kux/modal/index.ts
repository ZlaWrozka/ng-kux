import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KuxModalComponent, kuXModalInclude, kuxModalContent, kuxModalAni } from './modal.component';
import { KuxModalService } from './modal.helper';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [KuxModalComponent, kuXModalInclude,kuxModalContent],
  providers: [KuxModalService],
  exports: [KuxModalComponent]
})
class KuxModalModule { }

export { kuxModalAni, KuxModalModule ,kuxModalContent}

