import { Component, Directive, Self, ElementRef, OnInit, AfterViewInit, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { KuxScrollHelper } from './helper';


// 内容容器
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
export class kuxScrollbarContent {
  public el: HTMLElement
  constructor(
    el: ElementRef
  ) {
    this.el = el.nativeElement;
  }
  get height() {
    return this.el.offsetHeight;
  }
  get width() {
    return this.el.offsetWidth
  }
}

//<ng-content></ng-content> 
@Component({
  selector: 'kux-scrollbar',
  template: `
    <div class="kux-scrollbar-box" kux-scrolling (kuxScrolling)="scrollFn($event)" [ngClass]="{noselect:noselect}" (scroll)="emitScroll($event)">
        <kux-scrollbar-content>
          <ng-content></ng-content>
        </kux-scrollbar-content>
    </div>
    <div class="kux-scroll-bar-rail rail-y" [ngClass]="{keep:scrollBar.y.keep}" *ngIf="+scrollBar.y.active" (click)="jump($event,1)"><div (kuxDrag)="drag($event,1)" [bar]="scrollBar.y" [style.transform]="'translateY('+scrollBar.y.top+'px)'" [style.height.px]="scrollBar.y.height"></div></div>
    <div class="kux-scroll-bar-rail rail-x" [ngClass]="{keep:scrollBar.x.keep}" *ngIf="+scrollBar.x.active" (click)="jump($event,0)"><div (kuxDrag)="drag($event,0)" [bar]="scrollBar.x" [style.transform]="'translateX('+scrollBar.x.left+'px)'" [style.width.px]="scrollBar.x.width"></div></div>
  `,
  styleUrls: ['./scrollbar.component.css'],
  host: {
    '(window:resize)': 'directRefresh()',
    '[class]': 'autoHide?"kux-scrollbar auto-hide":"kux-scrollbar"'
  }
})
export class KuxScrollbarComponent implements OnInit, AfterViewInit {
  @ViewChild(kuxScrollbarContent) private content: kuxScrollbarContent
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Input() autoHide: boolean = false;
  @Input() mimiScrollBarLength: number = 20;
  @Input() initScrollTop: number = 0;
  @Input() initScrollLeft: number = 0;
  private box: HTMLElement;
  public noselect = false;
  public scrollBar = {
    x: { active: false, left: 0, width: 0, keep: false },
    y: { active: false, top: 0, height: 0, keep: false }
  }
  public container = {
    width: 0,
    height: 0,
    element: null
  }
  constructor(_el: ElementRef) {
    this.box = _el.nativeElement
  }
  emitScroll(e) {
    e.y = e.scrollTop = this.container.element.scrollTop;
    e.x = e.scrollLeft = this.container.element.scrollLeft;
    this.scroll.emit(e)
  }
  get containerHeight() {
    return (<HTMLElement>this.box.children[0]).offsetHeight;
  }
  get containerWidth() {
    return (<HTMLElement>this.box.children[0]).offsetWidth;
  }
  get scrollTop() {
    return this.container.element.scrollTop;
  }
  set scrollTop(t) {
    this.container.element.scrollTop = t;
    this.syncBar();
  }
  get scrollLeft() {
    return this.container.element.scrollLeft;
  }
  set scrollLeft(l) {
    this.container.element.scrollLeft = l;
    this.syncBar();
  }
  isScrollToBottom() {
    return this.container.element.scrollTop == this.content.height - this.container.height
  }
  isScrollToRight() {
    return this.container.element.scrollLeft == this.content.width - this.container.width;
  }
  drag(e, isY) {
    if (isY) {
      let newTop = e.beginY + e.distanceY,
        maxTop = this.container.height - this.scrollBar.y.height;
      if (newTop < 0) {
        this.scrollBar.y.top = 0;
      } else if (newTop > maxTop) {
        this.scrollBar.y.top = maxTop;
      } else {
        this.scrollBar.y.top = newTop;
      }
      this.container.element.scrollTop = this.scrollBar.y.top * (this.content.height - this.container.height) / (this.container.height - this.scrollBar.y.height)
    } else {
      let newLeft = e.beginX + e.distanceX,
        maxLeft = this.container.width - this.scrollBar.x.width;
      if (newLeft < 0) {
        this.scrollBar.x.left = 0;
      } else if (newLeft > maxLeft) {
        this.scrollBar.x.left = maxLeft;
      } else {
        this.scrollBar.x.left = newLeft;
      }
      this.container.element.scrollLeft = this.scrollBar.x.left * (this.content.width - this.container.width) / (this.container.width - this.scrollBar.x.width)
    }
  }
  scrollFn(e) {
    this.container.element.scrollTop += e.y;
    this.container.element.scrollLeft += e.x;
    let scrollTop = this.container.element.scrollTop,
      scrollLeft = this.container.element.scrollLeft;
    this.syncBar();
    let maxScrollTop = this.content.height - this.container.height,
      maxScrollLeft = this.content.width - this.container.width;
    if ((scrollTop == 0 || scrollTop == maxScrollTop) && (scrollLeft == 0 || scrollLeft == maxScrollLeft)) {
      //滚动到了边缘
    } else {
      (<MouseEvent>e.orgevent).stopPropagation();
      (<MouseEvent>e.orgevent).preventDefault();
    }
  }
  //适应滚动条最小高度
  private getBarSize(size) {
    return Math.max(this.mimiScrollBarLength, size);
  }
  jump(e: MouseEvent, isY: number) {
    if (isY) {
      let top = e.pageY - window.pageYOffset - this.pageOffset(this.container.element).top;
      this.container.element.scrollTop = (this.content.height - this.container.height) * (top / this.container.height);
    } else {
      let left = e.pageX - window.pageXOffset - this.pageOffset(this.container.element).left;
      this.container.element.scrollLeft = (this.content.width - this.container.width) * (left / this.container.width);
    }
    this.syncBar();
  }
  pageOffset(el: HTMLElement) {
    return el.getBoundingClientRect();
  }
  syncBar() {
    if (this.container.height < this.content.height) {
      this.scrollBar.y.active = true;
      this.scrollBar.y.height = this.getBarSize(this.container.height * this.container.height / this.content.height);
      this.scrollBar.y.top = this.container.element.scrollTop * (this.container.height - this.scrollBar.y.height) / (this.content.height - this.container.height)
    } else {
      this.scrollBar.y.active = false
    }
    if (this.container.width < this.content.width) {
      this.scrollBar.x.active = true;
      this.scrollBar.x.width = this.getBarSize(this.container.width * this.container.width / this.content.width);
      this.scrollBar.x.left = this.container.element.scrollLeft * (this.container.width - this.scrollBar.x.width) / (this.content.width - this.container.width);
    } else {
      this.scrollBar.x.active = false;
    }
  }
  private syncContainer() {
    let el = this.container.element;
    this.container.height = el.offsetHeight;
    this.container.width = el.offsetWidth;
    this.scrollBar.y.height = this.mimiScrollBarLength
  }
  ngOnInit() {
    this.container.element = this.box.children[0];
    this.container.element.scrollTop = this.initScrollTop;
    this.container.element.scrollLeft = this.initScrollLeft;
    this.directRefresh();
  }
  directRefresh() {
    this.syncContainer();
    this.syncBar();
  }
  refresh() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.syncContainer();
        this.syncBar();
        resolve();
      });
    })

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.refresh();
    })
  }
}