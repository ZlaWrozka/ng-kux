import { Component, Directive, Self, ElementRef, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Output, Input, EventEmitter, Renderer2 } from '@angular/core';
import { KuxScrollHelper } from './helper'
interface BarYAttr {
  show: boolean;
  style: {
    transform: string
    height: number | string
  };
}
interface BarXAttr {
  show: boolean;
  style: {
    transform: string
    width: number | string;
  }
}
/** Y轴滚动条
 * 
 * @export
 * @class ScrollBarY
 * @implements {OnInit}
 */
@Component({
  selector: 'kux-scrollbar-y',
  template: `<div class="kux-scrollbar-y" [ngStyle]="attr.style" (click)="stopEvent($event)"></div>`,
  styles: [
    `
    :host{
      position: absolute;
      height:100%;
      right:0;
      width:4px;
      opacity: 0;
      top:0;
      transition: opacity .2s;
    }
    :host.visible{
      opacity: .8;
    }
    :host:hover,:host.keep{
      width:8px;
      opacity: .8;
      background: #eee;
    }
    .kux-scrollbar-y{
      position: absolute;
      right: 0px;
      height:100px;
      width: 4px;
      background-color: #aaa;
      border-radius: 2px;
      cursor: pointer;
      transition: height .2s,background-color .2s;
    }
    :host:hover .kux-scrollbar-y,:host.keep .kux-scrollbar-y{
      width:8px;
      border-radius: 4px;
      background-color: #999;
    }
    `
  ],
  host: {
    '(mousedown)': 'fn.begingMove($event,0)',
    '[class]': `"kux-scrollbar-content"`,
    '(click)': 'jump($event)'
  },
  providers: [KuxScrollHelper]
})
export class ScrollBarY implements AfterViewInit {
  @Input() public attr: BarYAttr;
  @Input() public autoHide: boolean = true;
  @Output() public onDrag: EventEmitter<number> = new EventEmitter();
  @Output() public onJump: EventEmitter<number> = new EventEmitter();
  public fn: any;
  constructor(
    @Self() private helper: KuxScrollHelper,
    private el: ElementRef,
    private renderer: Renderer2
  ) {

    this.fn = this.helper.fn;
    this.helper.renderer = renderer;
    this.helper.scrollY.subscribe((d: number) => {
      this.onDrag.emit(d);
    });
    this.helper.dragY.subscribe((isKeepHover: boolean) => {
      if (isKeepHover) {
        renderer.addClass(el.nativeElement, 'keep')
      } else {
        renderer.removeClass(el.nativeElement, 'keep')
      }
    })
  }
  jump(e) {
    let el = <HTMLElement>this.el.nativeElement, top = 0;
    while (el.offsetParent !== null) {
      top += el.offsetTop;
      el = <HTMLElement>el.offsetParent;
    }
    this.onJump.emit((e.pageY - top) / this.el.nativeElement.offsetHeight)
  }
  stopEvent(e: MouseEvent) {
    e.stopPropagation();
  }
  ngAfterViewInit() {
    if (this.autoHide === false) {
      this.renderer.addClass(this.el.nativeElement, 'visible');
    }
  }
}


/** X轴滚动条
 * 
 * @export
 * @class ScrollBarX
 * @implements {OnInit}
 */
@Component({
  selector: 'kux-scrollbar-x',
  template: `<div class="kux-scrollbar-x" [ngStyle]="attr.style"  (click)="stopEvent($event)"></div>`,
  styles: [
    `
    :host{
      position: absolute;
      width:100%;
      bottom:0;
      height:4px;
      opacity: 0;
      transition: opacity .2s;
    }
    :host.visible{
      opacity: .8;
    }
    :host:hover,:host.keep{
      height:8px;
      opacity: .8;
      background: #eee;
    }
    .kux-scrollbar-x{
      position: absolute;
      bottom:0;
      left: 0;
      width:100px;
      height: 4px;
      background-color: #aaa;
      border-radius: 2px;
      cursor: pointer;
      transition: height .2s,background-color .2s;
    }
    :host:hover .kux-scrollbar-x, :host.keep .kux-scrollbar-x{
      height:8px;
      border-radius: 4px;
      background-color: #999;
    }
    `
  ],
  providers: [KuxScrollHelper],
  host: {
    '(mousedown)': 'fn.begingMove($event,1)',
    '[class]': '"kux-scrollbar-content"',
    '(click)': 'jump($event)'
  },
})
export class ScrollBarX implements AfterViewInit {
  @Input() public attr: BarXAttr;
  @Input() public autoHide: boolean = true;
  @Output() public onDrag: EventEmitter<number> = new EventEmitter();
  @Output() public onJump: EventEmitter<number> = new EventEmitter();
  public fn: any;
  constructor(
    @Self() private helper: KuxScrollHelper,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.fn = this.helper.fn;
    this.helper.renderer = renderer;
    this.helper.scrollX.subscribe((d: number) => {
      this.onDrag.emit(d);
    });
    this.helper.dragX.subscribe((isKeepHover: boolean) => {
      if (isKeepHover) {
        renderer.addClass(el.nativeElement, 'keep')
      } else {
        renderer.removeClass(el.nativeElement, 'keep')
      }
    })
  }
  jump(e) {
    let el = <HTMLElement>this.el.nativeElement, left = 0;
    while (el.offsetParent !== null) {
      left += el.offsetLeft;
      el = <HTMLElement>el.offsetParent;
    }
    this.onJump.emit((e.pageX - left) / this.el.nativeElement.offsetWidth)
  }
  stopEvent(e: MouseEvent) {
    e.stopPropagation();
  }
  ngAfterViewInit() {
    if (this.autoHide === false) {
      this.renderer.addClass(this.el.nativeElement, 'visible');
    }
  }
}


/** 内容容器
 * 
 * @export
 * @class ScrollbarContent
 */
@Component({
  selector: 'kux-scrollbar-content',
  template: `<ng-content></ng-content>`,
  styles: [
    `
    :host{
      display: block;
      float:left;
      min-width: 100%;
    }
    `
  ]
})
export class ScrollbarContent {
  public el: HTMLElement
  constructor(
    el: ElementRef
  ) {
    this.el = el.nativeElement;
  }
}



/** kux-scrollbar
 * 
 * @export
 * @class ScrollbarComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'kux-scrollbar',
  template: `
    <div class="kux-scrollbar-box" (wheel)="scrolling($event)">
      <kux-scrollbar-content>
        <ng-content></ng-content> 
      </kux-scrollbar-content>
    </div>
    <ng-template [ngIf]="barYAttr.show"><kux-scrollbar-y [attr]="barYAttr" (onDrag)="dragScrollY($event)" (onJump)="jumpY($event)" [autoHide]="autoHide"></kux-scrollbar-y></ng-template>
    <ng-template [ngIf]="barXAttr.show"><kux-scrollbar-x [attr]="barXAttr" (onDrag)="dragScrollX($event)" (onJump)="jumpX($event)" [autoHide]="autoHide"></kux-scrollbar-x></ng-template>
  `,
  styleUrls: ['./scrollbar.component.css'],
  host: {
    '[class]': '"kux-scrollbar"',
    '(window:resize)': "refresh()"
  }
})
export class KuxScrollbarComponent implements AfterViewInit {
  private $scrollTop: number = 0;
  private $scrollLeft: number = 0;
  private support: string;
  public inited: Promise<any>;
  /** 自动隐藏滚动条 */
  @Input() autoHide: boolean = true;
  @Input() private paddingOffset: number = 0;
  @Output() private onScroll: EventEmitter<{ x: number, y: number }> = new EventEmitter();    //向外部传播滚动事件
  @ViewChild(ScrollbarContent) private content: ScrollbarContent;                             //内容容器
  private box: HTMLElement;            //滚动容器；
  public boxHeight: number = 0;       //滚动容器高度
  public boxWidth: number = 0;        //滚动容器宽度
  public contentHeight: number = 0;   //内容高度
  public contentWidth: number = 0;    //内容宽度
  private maxYScroll: number = 0;      //Y轴最大滚动高度
  private maxXScroll: number = 0;      //X轴最大滚动高度
  private barYMaxTop: number = 0;      //Y轴滚动条最大高度
  private barXMaxLeft: number = 0;     //X轴滚动条最大左边距
  private emittedY: number = null;     //已广播出去的ScrollTop
  private emittedX: number = null;     //已广播出去的滚动ScrollLeft
  public barYAttr: BarYAttr = {        //Y轴滚动条属性
    show: false,
    style: {
      transform: 'translateY(0)',
      height: 0
    }
  };
  public barXAttr: BarXAttr = {
    show: false,
    style: {
      transform: 'translateX(0)',
      width: 0
    }
  }
  constructor(
    el: ElementRef
  ) {
    this.box = el.nativeElement;
  }
  private emitScrollEvent() {
    if (this.emittedY !== this.$scrollTop || this.emittedX !== this.$scrollLeft) {
      this.emittedY = this.$scrollTop;
      this.emittedX = this.$scrollLeft;
      this.onScroll.emit({ x: this.$scrollLeft, y: this.$scrollTop });
    }
  }
  jumpY(p: number) {
    this.scrollTop = p * this.maxYScroll
  }
  jumpX(p: number) {
    this.scrollLeft = p * this.maxXScroll
  }
  scrolling(e?: MouseWheelEvent, unEmit?: boolean) { //鼠标纵向滚动触发
    let scrollTop = this.box.children[0].scrollTop,
      scrollLeft = this.box.children[0].scrollLeft;
    if (e) {
      scrollTop += e.deltaY;
      scrollLeft += e.deltaX;

      this.box.children[0].scrollTop = scrollTop;
      scrollTop = this.box.children[0].scrollTop
      this.box.children[0].scrollLeft = scrollLeft;
      scrollLeft = this.box.children[0].scrollLeft;
    }

    this.$scrollTop = scrollTop;
    this.$scrollLeft = scrollLeft;
    if (unEmit !== true) {
      this.emitScrollEvent();
    }


    if (scrollTop <= 0) {
      this.barYAttr.style.transform = 'translateY(0)';
    } else if (scrollTop >= this.maxYScroll) {
      this.barYAttr.style.transform = `translateY(${this.barYMaxTop + 'px'})`;
    } else {
      if (e) { e.preventDefault() }
      this.barYAttr.style.transform = `translateY(${scrollTop / this.maxYScroll * this.barYMaxTop + 'px'})`;
    }
    if (scrollLeft <= 0) {
      this.barXAttr.style.transform = 'translateX(0)'
    } else if (scrollLeft >= this.maxXScroll) {
      this.barXAttr.style.transform = `translateX(${this.barXMaxLeft + 'px'})`;
    } else {
      if (e) { e.preventDefault() }
      this.barXAttr.style.transform = `translateX(${scrollLeft / this.maxXScroll * this.barXMaxLeft + 'px'})`;
    }
  }
  initScroll() { //初始化滚动参数
    this.boxHeight = this.box.offsetHeight;
    this.boxWidth = this.box.offsetWidth;
    this.contentHeight = this.content.el.offsetHeight;
    this.contentWidth = this.content.el.offsetWidth;
    this.maxYScroll = this.contentHeight - this.boxHeight;
    this.maxXScroll = this.contentWidth - this.boxWidth;
    let barHeight = this.boxHeight / this.contentHeight * this.boxHeight;
    let barWidth = this.boxWidth / this.contentWidth * this.boxWidth;
    if (barHeight < 30) {
      barHeight = 30;
    }
    if (barWidth < 30) {
      barWidth = 30;
    }
    this.barYAttr.style.height = barHeight + 'px';
    this.barXAttr.style.width = barWidth + 'px';
    this.barYMaxTop = this.boxHeight - barHeight;
    this.barXMaxLeft = this.boxWidth - barWidth;
    if (this.contentHeight > this.boxHeight) {
      this.barYAttr.show = true;
    } else {
      this.barYAttr.show = false;
    }
    if (this.contentWidth > this.boxWidth) {
      this.barXAttr.show = true;
    } else {
      this.barXAttr.show = false;
    }
  }
  dragScrollY(e: number) { //Y轴拖动
    let h = +this.barYAttr.style.transform.match(/(\d+)/)[0];
    h += e;
    if (h < 0) {
      h = 0
    }
    if (h > this.barYMaxTop) {
      h = this.barYMaxTop
    }
    this.barYAttr.style.transform = `translateY(${h + 'px'})`;
    this.box.children[0].scrollTop = h * this.maxYScroll / (this.barYMaxTop - this.paddingOffset);
    this.$scrollTop = this.box.children[0].scrollTop;
    this.emitScrollEvent()
  }
  dragScrollX(e: number) { //X轴拖动
    let l = +this.barXAttr.style.transform.match(/(\d+)/)[0];
    l += e;
    if (l < 0) {
      l = 0
    }
    if (l > this.barXMaxLeft) {
      l = this.barXMaxLeft
    }
    this.barXAttr.style.transform = `translateX(${l + 'px'})`;
    this.box.children[0].scrollLeft = l * this.maxXScroll / (this.barXMaxLeft - this.paddingOffset);
    this.$scrollLeft = this.box.children[0].scrollLeft;
    this.emitScrollEvent();
  }
  ngAfterViewInit() {
    this.inited = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.initScroll();
        resolve();
      })
    })
  }
  /** 是否滚动到了底部
   * 
   * @memberOf ScrollbarComponent
   */
  public isScrollToBottom() {
    return this.$scrollTop >= this.maxYScroll
  }

  /** 是否滚动到了最右侧
   * 
   * 
   * @memberOf ScrollbarComponent
   */
  public isScrollToRight() {
    return this.$scrollLeft >= this.maxXScroll
  }
  public refresh(unEmit?: boolean) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.initScroll();
        this.scrolling(null, unEmit);
        resolve();
      });
    });
  }
  get scrollTop() {
    return this.$scrollTop;
  }
  set scrollTop(scroll_top: number) {
    this.box.children[0].scrollTop = scroll_top;
    this.scrolling();
  }
  get scrollLeft() {
    return this.$scrollLeft;
  }
  set scrollLeft(scroll_left: number) {
    this.box.children[0].scrollLeft = scroll_left;
    this.scrolling();
  }
}