import { Component, Directive, OnInit, AfterViewInit, AfterContentChecked, ElementRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { KuxScrollbarComponent } from '../scrollbar/scrollbar.component';
@Directive({
    selector: '[kux-scroll-item]'
})
export class KuxScrollItemDirective implements OnInit {
    public el: HTMLElement;
    public height: number;
    public index: number;
    constructor(
        el: ElementRef
    ) {
        this.el = el.nativeElement
    }

    ngOnInit() {
        this.height = this.el.offsetHeight
    }
}



@Component({
    selector: 'kux-scroll',
    template: `
        <kux-scrollbar (onScroll)="scrollFn($event)" (wheel)="stopWheel($event)">
            <div class="kux-scroll-holder" [style.height]="holderHeight+'px'"></div>
            <ng-content></ng-content>
        </kux-scrollbar>
    `,
    host: {
        '(window:resize)': 'resizeFn()'
    }
})
export class KuxScrollComponent implements AfterViewInit {
    @ViewChild(KuxScrollbarComponent) private kuxScrollbar: KuxScrollbarComponent
    @ContentChildren(KuxScrollItemDirective) blockItem: QueryList<KuxScrollItemDirective>
    public getData: any = () => { return []; }
    public display: any = [];
    public holderHeight = 0;
    private isTop: boolean = true;
    private isBottom: boolean = false;
    private param = {
        length: 5,            //每片数据长度
        begin: 0,             //加载进度
        scrolledTop: 0,       //滚动过的高度
        delIndex: 0,          //删除到了第多少个
        itemHeightMapCache: {}
    }
    constructor(
        el: ElementRef
    ) {
    }
    scrollFn(e) {
        if (e.y > this.param.scrolledTop) {               //向下滚动
            this.findNextData()
            this.deletePreData(e.y)
            this.param.scrolledTop = e.y
        } else if (e.y <= this.param.scrolledTop) {        //向上滚动
            this.findPreData(e.y)
            this.delNextData(e.y)
            this.param.scrolledTop = e.y
        }
    }
    resizeFn() {
        let scrollTop = this.kuxScrollbar.scrollTop
        this.findNextData();
        this.deletePreData(scrollTop);
        this.delNextData(scrollTop)
    }
    public sync() {
        let d = this.getData(this.param.delIndex, this.param.begin - this.param.delIndex);
        if (d instanceof Array) {
            this.display = d;
        }
        if (d instanceof Promise) {
            d.then((list) => {
                this.display = list;
            })
        }
    }
    private delNextData(scrollTop) {
        let last = this.blockItem.last;
        if (last && last.el.offsetTop > this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight) {
            this.display.pop();
            this.param.begin--;
            this.kuxScrollbar.refresh().then(() => {
                this.delNextData(scrollTop)
            })
        }
    }
    private findPreData(scrollTop) {
        let first = this.blockItem.first;
        if (first) {
            if (this.param.delIndex > 0 && first.el.offsetTop - first.height >= scrollTop && first.el.offsetTop > scrollTop - 100) {
                this.findPreDataUnconditional(scrollTop)
            }
            if (this.param.delIndex == 0) {
                this.isTop = true;
            }
        } else {
            //防断
            this.findPreDataUnconditional(scrollTop)
        }
    }

    private findPreDataUnconditional(scrollTop) {
        let b = this.param.delIndex - this.param.length;
        let t = this.param.delIndex;
        if (b < 0) { b = 0; this.isTop = true; }
        if (b < t) {
            let newItem = this.getData(b, t - b);
            if (newItem.length !== 0) {
                this.isTop = false;
                this.display.unshift.apply(this.display, newItem);
                this.param.delIndex -= newItem.length;
                let h = 0;
                for (let i = b; i < t; i++) {
                    h += this.param.itemHeightMapCache[i]
                }
                this.holderHeight -= h;
                setTimeout(() => {
                    this.findPreData(scrollTop)
                }, 0)
            } else {
                this.isTop = true;
            }
        }
    }


    /**
     * 向下滚动删除上面的数据
     * 
     * @private
     * @param {any} scrollTop 
     * 
     * @memberof KuxScrollComponent
     */
    private deletePreData(scrollTop) {
        let first = this.blockItem.first;
        if (first && first.el.offsetTop + first.height < scrollTop) {
            this.holderHeight += first.height;
            this.param.itemHeightMapCache[this.param.delIndex] = first.height;
            this.display.shift(0);
            this.param.delIndex++;
            this.isTop = false;
            setTimeout(() => {
                this.deletePreData(scrollTop)
            })
        }
    }

    /**
     * 向下滚动加载数据
     * 
     * @private
     * 
     * @memberof KuxScrollComponent
     */
    private findNextData() {
        if (this.kuxScrollbar.contentHeight <= this.kuxScrollbar.boxHeight * 1.2 + this.kuxScrollbar.scrollTop) {
            this.kuxScrollbar.refresh(true).then(() => {
                let newItem = this.getData(this.param.begin, this.param.length);
                if (newItem instanceof Array) {
                    this.findNextDataUnconditional(newItem)
                } else if (newItem instanceof Promise) {
                    newItem.then((data: any[]) => {
                        this.findNextDataUnconditional(data)
                    })
                }

            })
        }
    }
    private findNextDataUnconditional(newItem: any[]) {
        if (newItem.length !== 0) {
            this.display.push.apply(this.display, newItem);
            this.param.begin += this.param.length;
            this.findNextData();
            this.isBottom = false;
        } else {
            this.isBottom = true;
        }
    }
    stopWheel(e: MouseEvent) {
        if (!(this.isTop || this.isBottom)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    ngAfterViewInit() {
        this.findNextData();
    }
}