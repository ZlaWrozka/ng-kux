import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { KuxScrollbarComponent } from '../scrollbar/scrollbar.component';
@Component({
    selector: 'kux-scroll-stable',
    template: `
        <kux-scrollbar (scroll)="scrollFn($event)" (wheel)="stopWheel($event)">
            <div class="kux-scroll-holder" [style.height.px]="topHolderHeight"></div>
            <ng-content></ng-content>
            <div class="kux-scroll-holder" [style.height.px]="bottomHolderHeight"></div>
        </kux-scrollbar>
        `,
    host: {
        '(window:resize)': 'resizeFn()'
    }
})

export class KuxScrollStableComponent implements AfterViewInit {
    @ViewChild(KuxScrollbarComponent) private kuxScrollbar: KuxScrollbarComponent
    @Input() private height: number;
    @Input() public autoHide: boolean
    private length: number = 5;
    public getData: any = () => { return []; }
    public display: any = [];
    private begin: number = 0;
    private end: number = 0;
    private maxEnd: number = 0;
    public topHolderHeight: number = 0;
    public bottomHolderHeight: number = 0;
    private scrollTopListWaitCheck: number[] = [-1];
    private scrolledTop: number = -1;
    private scrolling: boolean = false;
    private timmer = null;
    constructor() {

    }
    scrollFn(e) {
        this.scrollTopListWaitCheck.push(e.scrollTop)
        this.checkScrollList();
    }
    private checkScrollList() {
        if (this.scrolling) {
            clearTimeout(this.timmer)
            this.timmer = setTimeout(() => {
                this.checkScrollList();
            }, 10)
        } else {
            if (this.scrollTopListWaitCheck.length > 0) {
                let scrollTop = this.scrollTopListWaitCheck.pop();
                this.scrollTopListWaitCheck.length = 0;
                if (scrollTop > this.scrolledTop) {
                    this.delPreData();
                    this.findNextData();
                    this.bottomHolderHeight = (this.maxEnd - this.end) * this.height;
                    this.kuxScrollbar.refresh()
                } else if (scrollTop < this.scrolledTop) {
                    this.loadPreData();
                    this.bottomHolderHeight = (this.maxEnd - this.end) * this.height;
                    this.kuxScrollbar.refresh()
                }
                this.scrolledTop = scrollTop;
                this.scrolling = false;
            }
            this.scrolling = false;
        }

    }
    resizeFn() {
        this.scrolledTop++;
        this.scrollTopListWaitCheck.push(this.kuxScrollbar.scrollTop);
        this.checkScrollList();
    }
    private delPreData() {
        if (this.kuxScrollbar.scrollTop - this.kuxScrollbar.containerHeight * 0.2 > this.topHolderHeight + this.height * this.length) {
            let item = this.display.splice(0, this.length);
            this.topHolderHeight += this.length * this.height;
            this.begin += this.length;
            if (item !== 0) {
                this.delPreData();
            }
        }
    }
    private loadPreData() {
        let _begin = Math.floor((this.kuxScrollbar.scrollTop - this.kuxScrollbar.containerHeight * 0.2) / (this.height * this.length)) * this.length;
        if (_begin !== this.begin) {
            if (_begin <= 0) {
                _begin = 0
            }
            this.topHolderHeight = _begin * this.height;
            let end = this.end = Math.ceil((this.kuxScrollbar.scrollTop + this.kuxScrollbar.containerHeight * 1.2) / (this.height * this.length)) * this.length;
            this.display = this.getData(_begin, end - _begin);
            this.begin = _begin;
        }
    }
    //向后加载数据
    private findNextData() {
        if (this.display.length == 0) {
            let _begin = Math.floor((this.kuxScrollbar.scrollTop - this.kuxScrollbar.containerHeight * 0.2) / (this.height * this.length)) * this.length;
            this.end = _begin < 0 ? 0 : _begin;
        }
        if (this.canStopAdd() == false) {
            let item = this.getData(this.end, this.length);
            if (item.length !== 0) {
                this.end += item.length;
                if (this.end > this.maxEnd) {
                    this.maxEnd = this.end;
                }
                this.display.push.apply(this.display, item)
                this.findNextData();
            }
        }
    }
    private getSyncItems() {
        let length = this.end - this.begin;
        let item = this.getData(this.begin, length);
        if (item.length == length) {
            return item;
        } else if (item.length == 0) {
            this.begin -= length;
            this.end -= length;
            if (this.begin < 0) {
                this.begin = 0;
                this.end = length;
                return this.getData(0, length)
            }
            this.maxEnd = this.end;
            this.getSyncItems();
        } else {
            let def = Math.ceil((length - item.length) / this.length) * this.length;
            this.end = this.begin + item.length;
            this.maxEnd = this.end;
            this.begin -= def;
            if (this.begin < 0) {
                this.begin = 0;
            }
            return this.getData(this.begin, this.end - this.begin);
        }
    }
    public sync() {
        if (this.scrolling == false) {
            this.display = this.getSyncItems();
            this.findNextData();
            this.topHolderHeight = this.begin * this.height;
            this.bottomHolderHeight = (this.maxEnd - this.end) * this.height;
            this.kuxScrollbar.refresh();
        } else {
            setTimeout(() => {
                this.sync();
            }, 10);
        }
    }
    public reload() {
        this.scrolling = false;
        clearTimeout(this.timmer)
        this.display = [];
        this.kuxScrollbar.scrollTop = 0;
        this.topHolderHeight = 0;
        this.bottomHolderHeight = 0;
        this.scrolledTop = 0;
        this.maxEnd = 0;
        this.begin = 0;
        this.end = 0;
        this.scrollTopListWaitCheck=[-1];
        this.checkScrollList();
    }
    private canStopAdd() {
        return this.topHolderHeight + this.display.length * this.height > this.kuxScrollbar.scrollTop + this.kuxScrollbar.containerHeight * 1.2
    }
    ngAfterViewInit() {
        this.scrollTopListWaitCheck.push(0);
        this.checkScrollList();
        setInterval(() => {
            this.sync()
        }, 2000)
    }
    stopWheel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    }
}