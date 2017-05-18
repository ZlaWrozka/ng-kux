import { Component, Directive, OnInit, Input, Host, AfterViewInit, ElementRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { KuxScrollbarComponent } from '../scrollbar/scrollbar.component';
import { KuxScrollItemDirective } from './scroll.directive'
import { Subject } from 'rxjs/Subject'

@Component({
    selector: 'kux-scroll',
    template: `
        <kux-scrollbar (onScroll)="scrollFn($event)" (wheel)="stopWheel($event)">
            <div class="kux-scroll-holder" [style.height.px]="topHolderHeight"></div>
            <ng-content></ng-content>
            <div class="kux-scroll-holder" [style.height.px]="bottomHolderHeight"></div>
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
    public topHolderHeight = 0;
    public bottomHolderHeight = 0;
    private isTop: boolean = true;
    private isBottom: boolean = false;
    private param = {
        length: 5,            //每片数据长度         
        index2height: {},
        heightPoints: [],
        begin: -1,
        end: 0,
        scrolledTop: -1,
        direction: 1,
        recordItemNum: {}
    }
    public sync() {
        return new Promise((resolve, reject) => {
            let begin = (this.param.begin + 1) * this.param.length, length = this.param.end - begin;
            let newItems = this.getData(begin, length);
            newItems.map((item, index) => {
                item.$kuxindex = begin + index;
            });
            let d = length - newItems.length;
            this.param.end -= d;
            this.display = newItems;
            this.param.scrolledTop--;
            this.scrollTopList.push(this.kuxScrollbar.scrollTop);
            this.checkScrollTopList();
            this.kuxScrollbar.refresh(true).then(() => {
                this.param.scrolledTop++;
                this.scrollTopList.push(this.kuxScrollbar.scrollTop);
                this.checkScrollTopList();
                this.delPreData(this.kuxScrollbar.scrollTop);
                this.kuxScrollbar.refresh(true).then(() => {
                    resolve();
                })
            })
        })
    }
    public direction = 1;
    private scrolling = false;
    private timmer: number = 0;
    constructor(
        el: ElementRef
    ) {
    }
    private scrollTopList: any[] = []
    scrollFn(e) {
        this.scrollTopList.push(e.y);
        this.checkScrollTopList();
    }
    resizeFn() {
        this.param.direction = 1;
        this.aline(this.kuxScrollbar.scrollTop);
    }
    private checkScrollTopList() {
        if (this.scrolling == false) {
            this.scrolling = true
            let s = this.scrollTopList.pop();
            if (s > this.param.scrolledTop) {
                this.isTop = false;
                this.param.direction = 1;
                this.aline(s);
            } else if (s < this.param.scrolledTop) {
                this.isBottom = false;
                this.param.direction = 0;
                this.aline(s);
            } else {
                this.scrolling = false;
            }
            this.param.scrolledTop = s;
            this.scrollTopList.length = 0;
        } else {
            clearTimeout(this.timmer)
            this.timmer = setTimeout(() => {
                this.checkScrollTopList();
            })
        }
    }
    public aline(scrollTop) {
        if (this.param.direction == 1) {
            this.delPreData(scrollTop)
            this.fillNext();
        } else if (this.param.direction == 0) {
            this.getPreData(scrollTop);
        }
    }
    //向上滚动加载数据
    private getPreData(scrollTop) {
        let _begin = this.findFallPoint(scrollTop);
        if (_begin < this.param.begin) {
            this.isTop = false;
            this.param.direction = -1
            let b = (_begin + 1) * this.param.length;
            let preData = this.getData(b, (this.param.begin - _begin) * this.param.length)
            this.display.unshift.apply(this.display, preData);
            this.topHolderHeight = this.param.index2height[_begin * this.param.length] || 0;
            let pass = true;
            let orgL = this.display.length;
            this.display = this.display.filter((item) => {
                if (item.$kuxindex % this.param.length === 0) {
                    let index = item.$kuxindex - this.param.length
                    let t = this.param.index2height[index] || 0;
                    if (t < this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
                        return true;
                    } else {
                        pass = false;
                        return false;
                    }
                } else {
                    return pass;
                }
            });
            this.param.end -= (orgL - this.display.length)
            this.kuxScrollbar.refresh(true).then(() => {
                this.param.begin = _begin;
                this.scrolling = false
                this.param.direction = 0;
            });
        } else {
            this.isTop = true;
            this.scrolling = false
        }
    }
    //把前面看不见的删了
    private delPreData(scrollTop) {
        let _begin = this.findFallPoint(scrollTop);
        if (_begin > this.param.begin) {
            this.param.begin = _begin;
            let index = _begin * this.param.length + this.param.length;
            this.display = this.display.filter((item) => {
                return item.$kuxindex + 1 > index
            });
            this.topHolderHeight = this.param.index2height[_begin * this.param.length]
        }
    }
    //向后填充直到填满
    private fillNext() {
        if (this.param.direction == 1) {
            let last = this.blockItem.last;
            if (last && last.el.offsetTop + last.height >= this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
                this.scrolling = false;
                return;
            }
            this.findNextData().then(() => {
                this.kuxScrollbar.refresh(true).then(() => {
                    let last = this.blockItem.last;
                    if (last.el.offsetTop + last.height <= this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
                        this.fillNext();
                    } else {
                        this.param.direction = -1;
                        this.scrolling = false
                    }
                })
            }, () => {
                this.scrolling = false;
                this.param.direction = -1;
            });
        }
    }
    //寻找落点
    private findFallPoint(scrollTop) {
        let _begin = scrollTop - this.kuxScrollbar.boxHeight * 0.1;
        if (_begin < 0) {
            return -1
        } else {
            return this.binary(this.param.heightPoints, scrollTop)
        }
    }
    //二分查找-有改
    private binary(array, value) {
        var high = array.length - 1,
            low = 0;
        while (low <= high) {
            var m = Math.floor((high + low) / 2);
            if (array[m] == value) {
                return m;
            }
            if (value > array[m]) {
                low = m + 1;
            } else {
                high = m - 1;
            }
        }
        return Math.min(low, high);
    }
    //加载数据
    private findNextData() {
        return new Promise((resolve, reject) => {
            let newItem = <any[] | Promise<any>>this.getData(this.param.end, this.param.length);
            if (newItem instanceof Array) {
                this.isBottom = newItem.length == 0 ? true : false;
                if (this.isBottom) {
                    reject(true)
                    return;
                }
                this.display.push.apply(this.display, this.addKuXIndex(newItem));
                this.param.end += newItem.length;
                resolve()
            } else if (newItem instanceof Promise) {
                newItem.then((data: any[]) => {
                    this.isBottom = data.length == 0 ? true : false;
                    if (this.isBottom) {
                        reject(true)
                        return;
                    }
                    this.display.push.apply(this.display, this.addKuXIndex(newItem));
                    this.param.end += data.length;
                    resolve();
                })
            }
        })

    }
    //每条记录加上我的索引值
    private addKuXIndex(arr) {
        arr.map((item, index) => {
            item.$kuxindex = this.param.end + index;
        });
        return arr;
    }
    //每条记录init后告诉我它高度
    public addPoint(index, height) {
        let _index = Math.floor(index / this.param.length), __index = _index * this.param.length;
        let n = this.param.recordItemNum[_index] || 0;
        if (n >= this.param.length) {
            return;
        }
        n++;
        this.param.recordItemNum[_index] = n;
        let preH = this.param.index2height[__index - this.param.length] || 0;
        if (this.param.index2height[__index] === undefined) {
            this.param.index2height[__index] = preH + height;
            this.param.heightPoints[_index] = preH + height;
        } else {
            this.param.index2height[__index] += height;
            this.param.heightPoints[_index] += height;
        }
        let l = this.param.heightPoints.length;
        if (_index + 1 < l) {
            for (let i = _index + 1; i < l; i++) {
                this.param.heightPoints[i] += height;
                this.param.index2height[i * this.param.length] = (this.param.index2height[i * this.param.length] || 0) + height
            }
        }
    }
    stopWheel(e: MouseEvent) {
        if (!(this.isTop || this.isBottom)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    ngAfterViewInit() {
        this.kuxScrollbar.inited.then(() => {
            this.scrollTopList.push(0);
            this.checkScrollTopList();
        });
    }
}