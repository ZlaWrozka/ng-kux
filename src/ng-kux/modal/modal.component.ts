import {
  Component, Directive, ViewEncapsulation, Output, EventEmitter, HostBinding, HostListener, OnInit, ViewContainerRef, ViewChild, AfterViewInit, ElementRef, animate, trigger, state, keyframes, transition, style
} from '@angular/core';

import { KuxModalService } from './modal.helper'

const fadeInOut = trigger('fadeInOut', [
  state('in', style({ opacity: 1 })),
  transition('void => *', [
    style({ opacity: 0 }),
    animate(200)
  ]),
  transition('* => void', [
    animate(200, style({ opacity: 0 }))
  ])
])

@Component({
  selector: 'kux-modal',
  template: `
    <div class="kux-modal-mask" *ngIf="data.showMask" [@fadeInOut]="'in'"></div>
    <kux-modal-include #includeBox></kux-modal-include>
  `,
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInOut
  ],
  host: {
    class: 'kux-modal'
  }
})
export class KuxModalComponent implements AfterViewInit {
  @ViewChild('includeBox', { read: ViewContainerRef }) includeBox: kuXModalInclude;
  public data: any = {};
  constructor(
    private service: KuxModalService,
  ) {
    this.data = this.service.data;
  }

  ngAfterViewInit() {
    this.service.includeBox = this.includeBox;
  }

}

export const kuxModalAni = trigger('kuxModalAni', [
  state('downIn', style({ opacity: 1, transform: 'translateY(0px) scale(1,1)' })),
  state('leftIn', style([{ opacity: 1, transform: 'translateX(0px) scale(1,1)' }])),
  transition('void => downIn', [
    style({ opacity: 0, transform: 'translateY(-120px) scale(0.9,0.9)' }),
    animate(200)
  ]),
  transition('downIn => void', [
    animate(200, style({ opacity: 0, transform: 'translateY(120px) scale(0.9,0.9)' }))
  ]),
  transition('void => leftIn', [
    style([{ opacity: 0, transform: 'translateX(120px) scale(0.9,0.9)' }]),
    animate(200)
  ]),
  transition('leftIn => void', [
    animate(200, style([{ opacity: 0, transform: 'translateX(-120px) scale(0.9,0.9)' }]))
  ])
])


@Component({
  template: '<a>kuxModalContent</a>'
})
export class kuxModalContent {
  public $kuxAniSta;
  public $disableEscape=false;
  @HostBinding('class') $$className = 'kux-modal-include-content';
  @HostBinding('style.zIndex') $kuxZIndex = 1010;
  @HostListener('@kuxModalAni.done') $$aniEnd() {
    this.$emitter.emit({ action: '$aniEnd' })
  }
  @HostListener('document:keydown.escape',['$event']) $$isEsc(e) {
    if(!this.disableEscape){this.$emitter.emit({ action: '$close' })}
   
  }
  @Output() public $emitter: EventEmitter<any> = new EventEmitter();
}


@Directive({
  selector: 'kux-modal-include'
})
export class kuXModalInclude {
  constructor(
    private service: KuxModalService,
    private vcRef: ViewContainerRef
  ) {
    this.service.viewContainer = this.vcRef;
  }
}