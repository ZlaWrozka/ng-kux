import { Component, OnInit, Output, EventEmitter, trigger, state, style, transition, animate, HostBinding } from '@angular/core';
import { kuxModalContent, kuxModalAni } from '../../../ng-kux/modal';




@Component({
  animations: [kuxModalAni],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  host: {
    '[@kuxModalAni]': '$kuxAniSta'
  }
})
export class DialogComponent extends kuxModalContent implements OnInit {
  constructor(
  ) {
    super();
  }

  ngOnInit() {
  }
  close() {
    this.$emitter.emit({ action: '$close', data: 1 })
  }
}