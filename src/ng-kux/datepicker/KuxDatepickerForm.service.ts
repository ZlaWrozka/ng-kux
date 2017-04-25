import { Injectable } from '@angular/core';

@Injectable()
export class KuxDatepickerFormServiceService {
    public data: any = {
        position: {
            position: 'absolute',
            display: 'block'
        }
    };
    public fn: any = {};
    public placement: any;
    constructor() {
        this.fn.changeSize = this.changeSize.bind(this);
    }
    changeSize(h: any, btnComp) {
        let size = this.getBtnSize(btnComp.btn.nativeElement);
        this.creatStyle(h, size)
    }
    creatStyle(h: number, size: any) {
        this.data.position.top = size.h + 4 + 'px';
        this.data.position.left = '0px';
        if (this.placement instanceof Array) {
            if (this.placement.indexOf('top') !== -1) {
                this.data.position.top = -h - 4 + 'px';
            }
            if (this.placement.indexOf('center') !== -1) {
                this.data.position.left = size.w / 2 - 240 / 2 + 'px'
            }
            if (this.placement.indexOf('right') !== -1) {
                this.data.position.left = size.w - 240 + 'px';
            }
        } else {
            switch (this.placement) {
                case 'center':
                    this.data.position.left = size.w / 2 - 240 / 2 + 'px'
                    break;
                case 'top':
                    this.data.position.top = -h - 4 + 'px';
                    break;
                case 'right':
                    this.data.position.left = size.w - 240 + 'px';
            }
        }
    }
    getBtnSize(btn: HTMLElement) {
        return { h: btn.offsetHeight, w: btn.offsetWidth }
    }
}