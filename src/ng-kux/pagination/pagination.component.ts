import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'


@Component({
    selector: 'kux-pagination',
    template: `
        <ul *ngIf="total>limit" class="pagination">
            <li>
                <a class="width-page" [ngClass]="{disable:page===0}" (click)="gopage(0,page===0)">第一页</a>
            </li
            ><li>
                <a class="per-page" [ngClass]="{disable:page===0}" (click)="pre()">上页</a>
            </li
            ><li *ngFor="let pageNum of showPage();trackBy:$index" (click)="gopage(pageNum)">
                <a [ngClass]="{active:page===pageNum}" class="number-page">{{pageNum+1}}</a>
            </li
            ><li class="dot-dot" *ngIf="totalPage>max&&(page+(max+1)/2)<totalPage" (click)="goNextRange()">
                <a>
                    <i></i>
                </a>
            </li
            ><li>
                <a class="next-page" [ngClass]="{disable:page===totalPage-1}" (click)="next()">下页</a>
            </li
            ><li>
                <a class="width-page" [ngClass]="{disable:page===totalPage-1}" (click)="gopage(totalPage-1,page===totalPage-1)">最后一页</a>
            </li
            ><li class="jump-page">
                <input type="text" [(ngModel)]="userJump">
                <a [ngClass]="{disable:userJump===undefined||userJump===''||userJump===null}" (click)="jump()">前往</a>
            </li>
        </ul>
    `,
    host: {
        'class': 'kux-pagination'
    },
    styleUrls: ['./pagination.component.css']
})
export class KuxPaginationComponent implements OnInit {
    @Input('limit') limit: number;
    @Input('max') max: number = 7;
    @Input('total') total: number;
    @Input('page') page: number;
    @Output() public onPage: EventEmitter<any> = new EventEmitter<any>(false);
    private totalPage: number;
    private showPageList: number[];
    private userJump: number;
    constructor() {
        this.page = 0;
        this.userJump = undefined;
    }
    gopage(pn: number, isend?: boolean): void {
        if (!isend === true && this.page !== pn) {
            this.page = pn
            this.onPage.emit({ page: pn, limit: this.limit })
        }
    }
    reset() {
        this.page = 0;
    }
    jump() {
        let j = Number(this.userJump);
        if (!isNaN(j)) {
            if (j > 0 && j <= this.totalPage) {
                this.gopage(j - 1);
                this.userJump = undefined;
            } else if (j <= 0) {
                this.gopage(0);
            } else {
                this.gopage(this.totalPage - 1);
            }
        }
    }
    goNextRange() {
        let p = this.showPageList[this.showPageList.length - 1] + (this.max + 1) / 2;
        if (p < this.totalPage - 1) {
            this.gopage(p)
        } else {
            this.gopage(this.totalPage - 1);
        }
    }
    next(): void {
        if (this.totalPage - 1 > this.page) {
            this.page++;
            this.onPage.emit({ page: this.page, limit: this.limit })
        }
    }
    pre(): void {
        if (this.page > 0) {
            this.page--;
            this.onPage.emit({ page: this.page, limit: this.limit })
        }
    }
    ngOnInit(): void {
        if (this.max % 2 !== 1) {
            throw new Error(`[kuX Pagination]The parameter of 'max' must be a odd number, now max = ${this.max}; (default:max = 7)`)
        }
        if (!this.total && this.total !== 0) {
            this.total = 0;
            this.onPage.emit({ page: this.page, limit: this.limit })
        }
        this.totalPage = Math.ceil(this.total / this.limit);
    }
    showPage(): number[] {
        this.totalPage = Math.ceil(this.total / this.limit);
        let start: number,
            end: number,
            list: number[] = [];
        if (this.max >= this.totalPage) {
            start = 0;
        } else {
            let half: number = Math.floor(this.max / 2);
            start = this.page - half > 0 ? this.page - half : 0;
        }
        if (start + this.max > this.totalPage) {
            end = this.totalPage;
            start = this.totalPage - this.max > 0 ? this.totalPage - this.max : 0;
        } else {
            end = start + this.max;
        }
        for (; start < end; start++) {
            list.push(start);
        }
        this.showPageList = list;
        return list;
    }
}