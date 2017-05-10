import { Directive, OnInit, OnDestroy, Input, Inject, forwardRef, Host, ViewContainerRef, ElementRef } from '@angular/core';
import { NgForOf } from '@angular/common'
import { KuxScrollComponent } from './scroll.component'
@Directive({
    selector: '[kux-scroll-item]'
})
export class KuxScrollItemDirective implements OnInit {
    public el: HTMLElement;
    public height: number;
    public index: number;
    @Input('kux-scroll-item') item: any
    constructor(
        el: ElementRef,
        @Host() @Inject(forwardRef(() => KuxScrollComponent)) private parent?: KuxScrollComponent
    ) {
        this.el = el.nativeElement

    }
    ngOnDestroy() {
    }
    ngOnInit() {
        this.index = this.item.$kuxindex
        this.height = this.el.offsetHeight;
        this.parent.addPoint(this.index,this.height)
    }
}