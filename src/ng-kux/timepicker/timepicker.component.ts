import { Component, Directive, ElementRef, OnInit, Input, Self, Output, EventEmitter, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';
import { kuxDataFormat } from '../datepicker/datepicker.component'
import { fadeInOut } from '../animate';
import { UtilService } from '../utils/util'
@Directive({
  selector: '[kux-timepicker-btn]'
})
export class kuxTimepickerBtn {
  constructor(
    private btn: ElementRef
  ) {
  }
  focus() {
    this.btn.nativeElement.focus();
  }
}


@Component({
  selector: 'kux-timepicker[ngModel]',
  animations: [fadeInOut],
  template: `
    <button class="kux-timepicker-btn" kux-timepicker-btn (click)="open()" (blur)="tryToClose()">{{_value|kuxDataFormat:fmt}}</button>
    <div class="kux-timepicker-panel" (click)="setSelecting()" [@fadeInOut]="'in'" *ngIf="isOpen"  (mouseenter)="setSelecting()" (mouseleave)="mouseOut()">
      <ul>
          <li class="kux-timepicker-time-line">
              <div class="up" (click)="pageUp(0)"></div>
              <div *ngFor="let h of showTime.h;trackBy:$index" (click)="jump(h.n,0)" [ngClass]="{current:h.cur}">{{h.n}}</div>
              <div class="down" (click)="pageDown(0)"></div>
          </li>
          <li class="kux-timepicker-point-line">:</li>
          <li class="kux-timepicker-time-line">
              <div class="up" (click)="pageUp(1)"></div>
              <div *ngFor="let m of showTime.m;trackBy:$index" (click)="jump(m.n,1)" [ngClass]="{current:m.cur}">{{m.n}}</div>
              <div class="down" (click)="pageDown(1)"></div>
          </li>
          <li class="kux-timepicker-point-line" *ngIf="haveSecond">:</li>
          <li class="kux-timepicker-time-line" *ngIf="haveSecond">
              <div class="up" (click)="pageUp(2)"></div>
              <div *ngFor="let s of showTime.s;trackBy:$index" (click)="jump(s.n,2)" [ngClass]="{current:s.cur}">{{s.n}}</div>
              <div class="down" (click)="pageDown(2)"></div>
          </li>
      </ul>
    </div>
  `,
  styleUrls: ['./timepicker.component.css'],
  providers: [NgModel],
  host: {
    'class': 'kux-timepicker',
    'style': 'display:inline-block',
    '(valueChange)': 'onChange($event)',
    '[class]': 'disabled?"disabled":""'
  }
})
export class KuxTimepickerComponent implements OnInit {
  @ViewChild(kuxTimepickerBtn) private btn: kuxTimepickerBtn;
  @Output() private valueChange: EventEmitter<any> = new EventEmitter();
  @Input() private length: number = 5;
  @Input() public fmt: string = 'HH:mm:ss';
  @Input() public disabled: boolean = false;                                   //你懂得
  public isOpen: boolean = false;                                              //是否显示选项
  private onChange = (_: any) => { };
  private onTouched = () => { };
  private value: Date;
  public _value: Date;
  private selecting: boolean = false;
  private list24 = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
  private list60 = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"];
  public showTime = {
    h: [],
    m: [],
    s: []
  }
  tryToClose() {
    if (!this.selecting) {
      this.isOpen = false;
      this.selecting = false;
    }
  }
  mouseOut() {
    this.selecting = false;
  }
  setSelecting() {
    this.selecting = true;
    this.btn.focus();
  }
  $index(index: number) {
    return index;
  }
  pageDown(unit: number) {
    let end;
    switch (unit) {
      case 0:
        end = this.showTime.h[this.length - 1];
        end = +end.n + Math.ceil(this.length / 2);
        if (end > 23) {
          end = end - 24
        }
        break;
      case 1:
        end = this.showTime.m[this.length - 1];
        end = +end.n + Math.ceil(this.length / 2);
        if (end > 59) {
          end = end - 60
        }
        break;
      case 2:
        end = this.showTime.s[this.length - 1];
        end = +end.n + Math.ceil(this.length / 2);
        if (end > 59) {
          end = end - 60
        }
        break;
    }
    this.jump(end, unit)
  }
  pageUp(unit: number) {
    let first;
    switch (unit) {
      case 0:
        first = this.showTime.h[0];
        first = +first.n - Math.ceil(this.length / 2);
        if (first < 0) {
          first = 23 + first + Math.floor(this.length / 2) - 1;
        }
        break;
      case 1:
        first = this.showTime.m[0];
        first = +first.n - Math.ceil(this.length / 2);
        if (first < 0) {
          first = 59 + first + Math.floor(this.length / 2) - 1;
        }
        break;
      case 2:
        first = this.showTime.s[0];
        first = +first.n - Math.ceil(this.length / 2);
        if (first < 0) {
          first = 59 + first + Math.floor(this.length / 2) - 1;
        }
        break;
    }
    this.jump(first, unit)
  }
  jump(n: string | number, unit: number) {
    n = +n;
    let year = this._value.getFullYear(), month = this._value.getMonth(), day = this._value.getDate(), hour = this._value.getHours(), minutes = this._value.getMinutes(), second = this._value.getSeconds(), millisecond = this._value.getMilliseconds();
    switch (unit) {
      case 0:
        this.sync(new Date(year, month, day, n, minutes, second, millisecond));
        break;
      case 1:
        this.sync(new Date(year, month, day, hour, n, second, millisecond));
        break;
      case 2:
        this.sync(new Date(year, month, day, hour, minutes, n, millisecond));
        break;
    }
  }
  public haveSecond: boolean = true;
  constructor(
    @Self() private ngModel: NgModel
  ) {
    ngModel.valueAccessor = this;
  }
  open() {
    if (!this.disabled) {
      this.isOpen = this.isOpen && this.selecting ? false : true;
      if (this._value instanceof Date) {
        this.sync(this._value);
      }
    }
  }
  sync(d: Date) {
    let t = d.getTime(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds();
    this.showTime.h = this.fillList(h, 24).map((_h) => {
      return { n: _h, cur: +_h == h };
    });
    this.showTime.m = this.fillList(m, 60).map((_m) => {
      return { n: _m, cur: +_m == m };
    });
    if (this.haveSecond) {
      this.showTime.s = this.fillList(s, 60).map((_s) => {
        return { n: _s, cur: +_s == s };
      })
    }
    this._value = d
  }
  fillList(n, l) {
    let all = l == 24 ? this.list24 : this.list60;
    let list = [];
    let begin = n - Math.floor(this.length / 2), end = n + Math.ceil(this.length / 2);
    if (begin < 0) {
      list = list.concat(all.slice(l + begin, l));
      begin = 0;
    }
    if (end > l - 1) {
      list = list.concat(all.slice(begin, l));
      end = end - l
      list = list.concat(all.slice(0, end))
    } else {
      list = list.concat(all.slice(begin, end));
    }
    return list;
  }
  ngOnInit() {
    var mat = this.fmt.match(/^([Hh]{1,2}):([m]{1,2})(:[s]{1,2})?$/)
    if (mat == null) {
      throw new Error('unsupport fmt');
    }
    if (mat[3] === undefined) {
      this.haveSecond = false;
    } else {
      this.haveSecond = true;
    }
  }
  writeValue(v: any) {
    if (v !== this.value) {
      this.value = v;
      this._value = v;
    }
  }
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  onBlur() {
    this.onTouched();
  }
}




@Pipe({ name: 'kuxDataFormat' })
export class kuxDataFormat2 implements PipeTransform {
  constructor(
    private util: UtilService
  ) { }
  transform(value: Date, fmt: string): string {
    return this.util.dateFormat(value, fmt || 'yyyy/MM/dd')
  }
}