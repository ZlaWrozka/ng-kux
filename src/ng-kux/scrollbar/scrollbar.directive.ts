import { Directive, Output, EventEmitter, OnInit, Input, ElementRef, Host, Inject, forwardRef, Renderer2 } from '@angular/core';
import { KuxScrollbarComponent } from './scrollbar.component'
declare let window: any
@Directive({
    selector: '[kuxDrag]',
    host: {
        '(mousedown)': 'begin($event)',
        '(click)': 'stopEvent($event);'
    }
})
export class kuxDrag {
    @Output() kuxDrag: EventEmitter<any> = new EventEmitter();
    @Input() bar: any;
    private el: HTMLElement
    constructor(
        _el: ElementRef,
        private renderer: Renderer2,
        @Host() @Inject(forwardRef(() => KuxScrollbarComponent)) private parent?: KuxScrollbarComponent
    ) {
        this.el = _el.nativeElement
    }
    private isBegin = false;
    private begin(e: MouseEvent) {
        this.parent.noselect = true;
        this.bar.keep = true;
        let beginPost = { x: e.pageX, y: e.pageY }
        let beginBarPost = { left: this.parent.scrollBar.x.left, top: this.parent.scrollBar.y.top }
        this.isBegin = true;
        let listeMoveBegin = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
            this.kuxDrag.emit({
                beginX: beginBarPost.left,
                beginY: beginBarPost.top,
                distanceY: e.pageY - beginPost.y,
                distanceX: e.pageX - beginPost.x
            });
        })
        let listeMoveEnd = this.renderer.listen('document', 'mouseup', () => {
            this.bar.keep = false;
            listeMoveBegin();
            listeMoveEnd();
            this.parent.noselect = false;
        })
    }
    pageOffset(el: HTMLElement) {
        return el.getBoundingClientRect();
    }
    drag(e: MouseEvent) {


    }
    stopEvent(event: MouseEvent) {
        event.stopPropagation();
    }
    end() {
        this.isBegin = false;
    }
}

@Directive({
    selector: '[kuxScrolling]',
    host: {
        '(wheel)': 'mouseWheel($event)',
        '(touchstart)': 'recordTouch($event)',
        '(touchend)': 'stop_recordTouch($event)',
        '(touchmove)': 'touchMoveFn($event)'
    }
})
export class kuxScrollingDirective {
    @Output() public kuxScrolling: EventEmitter<any> = new EventEmitter();
    @Output() public showText: EventEmitter<any> = new EventEmitter();
    private easing: any = null;
    private isRecordTouch: boolean = false;
    private startTime: number;
    private startOffset = {
        pageX: 0,
        pageY: 0
    }
    private speed = {
        x: 0,
        y: 0
    }
    private beginTouch = {
        x: 0, y: 0
    }
    public recordTouch(e) {
        clearInterval(this.easing);
        this.isRecordTouch = true;
        e = this.fixTouch(e);
        this.startTime = new Date().getTime();
        this.startOffset.pageX = this.beginTouch.x = e.pageX;
        this.startOffset.pageY = this.beginTouch.y = e.pageY;
    }
    public stop_recordTouch(e) {
        e = this.fixTouch(e);
        this.isRecordTouch = false;
        clearInterval(this.easing);
        this.easing = setInterval(() => {
            clearInterval(this.easing);
            if (!this.speed.x && !this.speed.y) {
                clearInterval(this.easing);
                return;
            }
            if (Math.abs(this.speed.x) < 0.01 && Math.abs(this.speed.y) < 0.01) {
                clearInterval(this.easing);
                return;
            }
            this.kuxScrolling.emit({
                x: this.speed.x * 30,
                y: this.speed.y * 30,
                ox: this.beginTouch.x,
                orgevent: e,
                target: e.target
            });
            this.speed.x *= 0.8;
            this.speed.y *= 0.8;
        }, 10)
    }

    public touchMoveFn(_e) {
        if (this.isRecordTouch) {
            let e = this.fixTouch(_e);
            let currentOffset = { pageX: e.pageX, pageY: e.pageY };
            let differenceX = currentOffset.pageX - this.startOffset.pageX;
            let differenceY = currentOffset.pageY - this.startOffset.pageY;
            this.startOffset = currentOffset;
            let currentTime = new Date().getTime();
            let timeGap = currentTime - this.startTime;
            if (timeGap > 0) {
                this.speed.x = differenceX / timeGap;
                this.speed.y = differenceY / timeGap;
                this.startTime = currentTime;
            }
            this.kuxScrolling.emit({
                x: this.beginTouch.x - currentOffset.pageX,
                y: this.beginTouch.y - currentOffset.pageY,
                ox: this.beginTouch.x,
                orgevent: _e,
                target: e.target
            });
            this.beginTouch.x = currentOffset.pageX;
            this.beginTouch.y = currentOffset.pageY;
        }
    }
    private fixTouch(e) {
        if (e.targetTouches) {
            return e.targetTouches[0];
        } else {
            return e;
        }
    }
    mouseWheel(e: MouseWheelEvent) {
        this.kuxScrolling.emit({
            x: e.deltaX,
            y: e.deltaY,
            target: e.target,
            orgevent: e
        });
    }
}