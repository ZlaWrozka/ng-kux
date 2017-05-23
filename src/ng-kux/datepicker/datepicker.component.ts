import { Component, Directive, OnInit, Input, Output, Self, Pipe, PipeTransform, EventEmitter, ElementRef, ViewChild,AfterViewInit } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';
import { KuxDatepickerPanelService } from './KuxDatepickerPanel.service';
import { KuxDatepickerFormServiceService } from './KuxDatepickerForm.service'
import { UtilService } from '../utils/util';
import { fadeInOut } from '../animate'
@Directive({
  selector: '[kux-datepicker-btn]'
})
export class kuxDatepickerBtn {
  constructor(
    private btn: ElementRef
  ) {
  }
  focus() {
    this.btn.nativeElement.focus();
  }
}

@Component({
  selector: 'kux-datepicker[ngModel]',
  template: `
    <button kux-datepicker-btn class="kux-datepicker-input" (blur)="tryToClose()" (click)="open()">{{value|kuxDataFormat:fmt}}</button>
    <kux-datepicker-panel [date]="value" [step]="step" [fmt]="panleFmt" [min]="min" [max]="max" [@fadeInOut]="'in'" (onSelect)="pickDate($event)" (mouseenter)="setSelecting()" (click)="setSelecting()" (mouseleave)="mouseOut()" *ngIf="isOpen" [ngStyle]="data.position" (onSizeChange)="fn.changeSize($event,btn)"></kux-datepicker-panel>
  `,
  providers: [NgModel, KuxDatepickerFormServiceService],
  animations: [fadeInOut],
  styles: [
    `
      .kux-datepicker-input{
        height: 28px;
        padding-left: 10px;
        cursor: pointer;
        text-align: left;
        color: #333;
        border: #d3d3d3 solid 1px;
        border-radius: 4px;
        background: #fff;
        outline:none !important;
        width:120px;
      }
      .kux-datepicker-input::-moz-focus-inner {
        border: 0;
      }
      :host.disabled >>> .kux-datepicker-input
      {
          background-color: #f1f1f1;
          cursor: default;
      }
    `
  ],
  host: {
    'style': 'display:inline-block;position: relative;',
    '(valueChange)': 'onChange($event)',
    '[class]': 'disabled?"disabled":""'
  },
})
export class KuxDatepickerComponent implements OnInit,AfterViewInit {
  public value: any;
  @Input() public min: Date;
  @Input() public max: Date;
  @Input() public today: Date;
  @Input() public placement: any;
  // @Input() public placeholder: string;
  @Input() public step: number;
  @Input() public disabled: boolean = false;                                     //你懂得
  @Input() public panleFmt: string = 'MM/dd/yyyy';
  @Input() public fmt: string = 'MM/dd/yyyy';
  @Output() private valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(kuxDatepickerBtn) private btn: kuxDatepickerBtn;
  public isOpen: boolean = false;                                           //是否显示日期面板
  private onChange = (_: any) => { };
  private onTouched = () => { };
  private selecting: boolean = false;
  public data: any;
  public fn: any;
  constructor(
    @Self() private ngModel: NgModel,
    @Self() private service: KuxDatepickerFormServiceService
  ) {
    ngModel.valueAccessor = this;
    this.data = this.service.data;
    this.fn = this.service.fn;
  }

  pickDate(d: any) {
    this.value = d;
    this.isOpen = false;
    this.selecting = false;
    this.valueChange.emit(this.value);
  }


  open() {
    if (!this.disabled) {
      this.isOpen = this.isOpen && this.selecting ? false : true;
      this.btn.focus();
    }
  }
  tryToClose() {
    if (!this.selecting) {
      this.isOpen = false;
      this.selecting = false;
    }
  }
  setSelecting() {
    this.selecting = true;
    this.btn.focus();
  }
  mouseOut() {
    this.selecting = false;
  }
  ngOnInit() {
    this.service.placement = this.placement;
  }
  ngAfterViewInit(){
   
  }
  writeValue(v: any) {
    if (v !== this.value && v instanceof Date) {
      this.value = v;
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


@Component({
  selector: 'kux-datepicker-panel',
  template: `
    <div class="kux-datepicker-panel">
        <div class="kux-datepicke-step" *ngIf="data.step===3">
          <div>
            <div class="kux-datepicker-opt">
                <div class="kux-arrow-left kux-icon-kux-arrow-left" (click)="fn.preMonth()"></div>
                <span (click)="fn.goStep(2)">{{data.display|kuxDataFormat:fmt}}</span>
                <div class="kux-arrow-right kux-icon-kux-arrow-right" (click)="fn.nextMonth()"></div>
            </div>
          </div>
          <ul class="kux-datepicker-week-title">
              <li *ngFor="let w of data.weeks">{{w}}</li>
          </ul>
          <ng-template ngFor let-week  [ngForOf]="data.days" [ngForTrackBy]="$index">
            <ul (click)="fn.selectDay($event)">
              <ng-template ngFor let-day  [ngForOf]="week" [ngForTrackBy]="$index">
                <li [attr.data-day]="day.number" [attr.data-jump]="day.jump" [ngClass]="{'kux-datepicker-disable':day.disable,'kux-datepicker-gray':!day.isCurrMonth,'kux-datepicker-today':day.number===data.today,'kux-datepicker-check':day.number===data.checkedDay}">{{day.day}}</li>
              </ng-template>
            </ul>
          </ng-template>
      </div>
      <div class="kux-datepicke-step kux-datepicke-step2" *ngIf="data.step===2">
          <div>
              <div class="kux-datepicker-opt">
                  <div class="kux-arrow-left kux-icon-kux-arrow-left" (click)="fn.preYear()"></div>
                  <span (click)="fn.goStep(1)">{{data.display|kuxDataFormat:'yyyy年'}}</span>
                  <div class="kux-arrow-right kux-icon-kux-arrow-right" (click)="fn.nextYear()"></div>
              </div>
          </div>
          <ng-template ngFor let-line  [ngForOf]="data.months" [ngForTrackBy]="$index">
            <ul ng-repeat="line in data.months track by $index" (click)="fn.selectMonth($event)">
              <ng-template ngFor let-month [ngForOf]="line" [ngForTrackBy]="$index">
                <li [ngClass]="{'kux-datepicker-check':month.number===data.checkedMonth,'kux-datepicker-disable':month.disable}" [attr.data-month]="month.number">{{month.month}}月</li>
              </ng-template>
            </ul>
          </ng-template>
      </div>
      <div class="kux-datepicke-step kux-datepicke-step2" *ngIf="data.step===1">
          <div>
              <div class="kux-datepicker-opt">
                  <div class="kux-arrow-left kux-icon-kux-arrow-left" (click)="fn.preManyYear()"></div>
                  <span>{{data.yearRange[0]}}年-{{data.yearRange[1]}}年</span>
                  <div class="kux-arrow-right kux-icon-kux-arrow-right" (click)="fn.nextManyYear()"></div>
              </div>
          </div>
          <ng-template ngFor let-line  [ngForOf]="data.years" [ngForTrackBy]="$index">
            <ul (click)="fn.selectYear($event)">
              <ng-template ngFor let-year [ngForOf]="line" [ngForTrackBy]="$index">
                <li [ngClass]="{'kux-datepicker-check':year.number===data.checkedYear,'kux-datepicker-disable':year.disable}" [attr.data-year]="year.number">{{year.year}}</li>
              </ng-template>
            </ul>
          </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['../public/styles.css', './datepicker.component.css'],
  providers: [KuxDatepickerPanelService]
})
export class KuxDatepickerPanelComponent implements OnInit {
  @Input() private date: Date;
  @Input() private min: Date;
  @Input() private max: Date;
  @Input() private today: Date;
  @Input() private step: number;
  @Input() private fmt: string = 'MM/dd/yyyy';
  @Output() public onSelect: EventEmitter<Date> = new EventEmitter();
  @Output() public onSizeChange: EventEmitter<Number> = new EventEmitter();
  public data: any = {};
  public fn: any = {};
  constructor(
    @Self() private service: KuxDatepickerPanelService
  ) {
    this.data = this.service.data;
    this.fn = this.service.fn;
    this.service.dateChange.subscribe((d) => {
      this.onSelect.emit(d);
    });
    this.service.height.subscribe((h: number) => {
      this.onSizeChange.emit(h);
    });
  }
  ngOnInit() {
    this.service.init(this.date, this.today, this.min, this.max, this.step);
  }

  $index(index) {
    return index;
  }
}

@Pipe({ name: 'kuxDataFormat' })
export class kuxDataFormat implements PipeTransform {
  constructor(
    private util: UtilService
  ) { }
  transform(value: Date, fmt: string): string {
    return this.util.dateFormat(value, fmt || 'yyyy/MM/dd')
  }
}



