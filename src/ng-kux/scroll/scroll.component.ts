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
        point2index: {},
        heightPoints: [],
        begin: -1,
        end: 0,
        scrolledTop: -1,
        direction: 1,
        tmpHeightMap: {}
    }
    public direction = 1;
    private scrolling = false;
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
                this.param.direction = 1;
                this.aline(s);
            } else if (s < this.param.scrolledTop) {
                this.param.direction = 0;
                this.aline(s);
            } else {
                this.scrolling = false
            }
            this.param.scrolledTop = s;
            this.scrollTopList.length = 0;
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
    private getPreData(scrollTop) {
        let _begin = this.findFallPoint(scrollTop);
        if (_begin < this.param.begin) {
            this.param.direction = -1
            let b = (_begin + 1) * this.param.length;
            this.display.unshift.apply(this.display, this.getData(b, (this.param.begin - _begin) * this.param.length));
            this.topHolderHeight = this.param.index2height[_begin * this.param.length] || 0;
            let pass = true;
            this.display = this.display.filter((item) => {
                if (item.$kuxindex % this.param.length === 0) {
                    let index = item.$kuxindex - this.param.length
                    let t = this.param.index2height[index] || 0;
                    this.param.end = index + this.param.length
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
            this.kuxScrollbar.refresh(true).then(() => {
                this.param.begin = _begin;
                this.scrolling = false
                this.param.direction = 0;
            });
        } else {
            this.scrolling = false
        }
    }
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
    private fillNext() {
        if (this.param.direction == 1) {
            let last = this.blockItem.last; last = this.blockItem.last;
            if (last && last.el.offsetTop + last.height >= this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
                this.scrolling = false;
                return;
            }
            this.findNextData().then(() => {
                this.kuxScrollbar.refresh(true).then(() => {
                    let last = this.blockItem.last; last = this.blockItem.last
                    if (last.el.offsetTop + last.height <= this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
                        this.fillNext();
                    } else {
                        this.param.direction = -1;
                        this.scrolling = false
                    }
                })
            });
        }
    }
    private findFallPoint(scrollTop) {
        let _begin = scrollTop - this.kuxScrollbar.boxHeight * 0.1;
        if (_begin < 0) {
            return -1
        } else {
            return this.binary(this.param.heightPoints, scrollTop)
        }
    }
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
    private findNextData() {
        return new Promise((resolve, reject) => {
            let newItem = <any[] | Promise<any>>this.getData(this.param.end, this.param.length);
            if (newItem instanceof Array) {
                this.display.push.apply(this.display, this.addKuXIndex(newItem));
                this.param.end += this.param.length;
                resolve()
            } else if (newItem instanceof Promise) {
                newItem.then((data: any[]) => {
                    this.display.push.apply(this.display, this.addKuXIndex(newItem));
                    this.param.end += this.param.length;
                    resolve();
                })
            }
        })

    }
    private addKuXIndex(arr) {
        arr.map((item, index) => {
            item.$kuxindex = this.param.end + index;
        });
        return arr;
    }

    public addPoint(index, height) {
        this.param.tmpHeightMap[index] = height;
        if ((index + 1) % this.param.length !== 0) {
            return;
        }
        let _index = index + 1 - this.param.length

        let h = 0, pre = 0;

        if (this.param.index2height[_index] == undefined) {
            if (_index !== 0) {
                pre = this.param.heightPoints[this.param.point2index[_index - this.param.length]];
            }
            for (let i = index; i > index - this.param.length; i--) {
                h += this.param.tmpHeightMap[i] || 0;
            }
            h += pre;
            this.param.heightPoints.push(h);
            this.param.index2height[_index] = h
            this.param.point2index[_index] = this.param.heightPoints.length - 1;
        }
    }

    // public scrollFn(e) {
    //     this.aline(e.y < this.param.scrolledTop);
    //     this.param.scrolledTop = e.y;
    // }
    // public aline(isUp?: boolean) {
    //     let arr = this.blockItem.toArray();
    //     if (this.param.renderTimmer !== null) {
    //         return;
    //     }
    //     if (arr.length === 0) {
    //         // this.findPreData();
    //     }
    //     if (arr.length < this.param.length) {
    //         return;
    //     }
    //     let overTop = { index: null, height: 0, length: 0, stopH: 0, kuxIndex: 0 },
    //         overBottom = { index: null, height: 0, length: 0, stopH: 0, kuxIndex: 0 },
    //         needNext = false,
    //         needPre = false,
    //         length = arr.length;
    //     let recordOverTop = true;
    //     let recordOverBottom = false;
    //     for (let i = 0; i < length; i++) {
    //         let innerH = 0, item = arr[i];
    //         innerH += item.height;
    //         if (recordOverTop) { overTop.height += item.height; overTop.length++ }
    //         if (i % this.param.length === 0) {
    //             innerH = 0;
    //             let pieceFirst = arr[i],
    //                 pieceLast = arr[i + this.param.length - 1];
    //             if (i == 0) {
    //                 if (pieceFirst.el.offsetTop > this.kuxScrollbar.scrollTop - this.kuxScrollbar.boxHeight * 0.1) {
    //                     needPre = true;
    //                 }
    //             }
    //             if (i == 0 && pieceFirst && pieceFirst.el.offsetTop > this.kuxScrollbar.scrollTop - this.kuxScrollbar.boxHeight * 0.1) { needPre = true; }
    //             if (pieceLast && pieceLast.el.offsetTop < this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.1) { needNext = true } else { needNext = false }
    //             if (pieceLast && pieceLast.el.offsetTop < this.kuxScrollbar.scrollTop - this.kuxScrollbar.boxHeight * 0.2) {
    //                 overTop.index = i;
    //                 overTop.stopH = item.height;
    //                 overTop.kuxIndex = pieceLast.item._kuxindex + 1;
    //             } else {
    //                 recordOverTop = false;
    //             }
    //             if (pieceFirst && pieceFirst.el.offsetTop > this.kuxScrollbar.scrollTop + this.kuxScrollbar.boxHeight * 1.2) {
    //                 recordOverBottom = true;
    //                 overBottom.index = i;
    //                 overBottom.kuxIndex = pieceFirst.item._kuxindex + 1;
    //             }

    //         }
    //         if (recordOverBottom) { overBottom.height += item.height; overBottom.length++; }
    //     }
    //     if (needNext) {
    //         this.findNextData();
    //     }
    //     if (needPre) {
    //         this.findPreData();
    //     }
    //     if (overBottom.index !== null) {
    //         this.param.bottomIndex = overBottom.kuxIndex;
    //         let del = this.display.splice(overBottom.index);
    //     }

    //     if (overTop.index !== null) {
    //         let h = overTop.height - overTop.stopH;
    //         this.topHolderHeight += (overTop.height - overTop.stopH)
    //         this.param.topIndex = overTop.kuxIndex;
    //         let del = this.display.splice(0, overTop.length - 1);
    //     }

    // }
    // private broken() {
    //     let end = Math.round(this.param.bottomIndex / 5) * 5;
    //     for (let i = end; i >= 0; i--) {
    //         if (i % this.param.length === 0) {

    //         }
    //     }
    // }
    // private findPreData() {
    //     let newItem = <any[]>this.getData(this.param.topIndex - this.param.length, this.param.length);
    //     let h = 0;
    //     newItem.forEach((item) => {
    //         h += this.param.itemHeightMapCache[item._kuxindex] || 0;
    //     })
    //     this.display.unshift.apply(this.display, newItem);
    //     this.topHolderHeight -= h;
    //     this.param.topIndex -= this.param.length;
    // }
    // private findNextData() {
    //     let newItem = <any[] | Promise<any>>this.getData(this.param.bottomIndex, this.param.length);
    //     if (newItem instanceof Array) {
    //         this.display.push.apply(this.display, this.addKuXIndex(newItem));
    //         this.param.bottomIndex += this.param.length;
    //         this.param.bottomIndex = this.param.bottomIndex;
    //     } else if (newItem instanceof Promise) {
    //         newItem.then((data: any[]) => {
    //             this.display.push.apply(this.display, this.addKuXIndex(newItem));
    //             this.param.bottomIndex += this.param.length;
    //             this.param.bottomIndex = this.param.bottomIndex;
    //         })
    //     }
    // }
    // public renderFinish(index, height?: number) {
    //     if (height !== undefined) {
    //         this.param.itemHeightMapCache[index] = height;
    //     }
    //     if (this.param.renderTimmer !== null) {
    //         clearTimeout(this.param.renderTimmer);
    //         this.param.renderTimmer = setTimeout(() => {
    //             this.kuxScrollbar.refresh(true).then(() => {
    //                 this.param.renderTimmer = null;
    //                 this.aline();
    //             })
    //         })
    //     } else {
    //         this.param.renderTimmer = setTimeout(() => {
    //             this.kuxScrollbar.refresh(true).then(() => {
    //                 this.param.renderTimmer = null;
    //                 this.aline();
    //             })
    //         })
    //     }
    // }


    // private addKuXIndex(arr) {
    //     arr.map((item, index) => {
    //         item._kuxindex = this.param.bottomIndex + index;
    //     });
    //     return arr;
    // }

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