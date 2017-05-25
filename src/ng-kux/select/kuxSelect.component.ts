import { Component, Directive, Self, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';
import { KuXSelectOption } from './index';
import { fadeInOut } from '../animate';
@Directive({
  selector: '[kux-select-btn]'
})
export class kuxSelectBtn {
  constructor(
    private btn: ElementRef
  ) {
  }
  focus() {
    this.btn.nativeElement.focus();
  }
}


@Component({
  selector: 'kux-select[ngModel]',
  animations: [fadeInOut],
  template:
  `
    <button kux-select-btn [style.width]="width" class="kux-select-btn" (blur)="tryToClose()" (click)="open()">{{selected.name||placeholder}}</button>
    <kux-select-opt #kuxSelectOpt [@fadeInOut]="'in'" [opt]="options" [maxHeight]="maxHeight" [width]="optwdith" (oncheck)="select($event)" *ngIf="isOpen" (mouseenter)="setSelecting()" (mouseleave)="mouseOut()"></kux-select-opt>
  `,
  providers: [NgModel],
  styleUrls: ['./kuxSelect.component.css'],
  host: {
    'class': 'kux-select',
    'style': 'display:inline-block',
    '(valueChange)': 'onChange($event)',
    '[class]': 'disabled?"disabled":""'
  }
})
export class KuxSelectComponent implements OnInit {
  @Input() public options: KuXSelectOption[];    //选项
  @Input() public width: string = '205px';       //btn宽度
  @Input() public optwdith: string = '205px';    //选项宽度
  @Input() public placeholder: string;           //你懂得
  @Input() public disabled: boolean = false;     //你懂得
  @Input() public maxHeight: string;             //选项最大高度
  @Output() private valueChange: EventEmitter<any> = new EventEmitter();
  private optionsMapping: any;                   //选项mapping
  public selected: KuXSelectOption;
  public value: any;
  public isOpen: boolean = false;                //是否显示选项
  private selecting: boolean = false
  private onChange = (_: any) => { };
  private onTouched = () => { };
  @ViewChild(kuxSelectBtn) private btn: kuxSelectBtn;
  constructor(
    @Self() private ngModel: NgModel,
    private el: ElementRef
  ) {
    this.selected = {
      name: null,
      value: null
    };
    ngModel.valueAccessor = this;
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
  select(opt: KuXSelectOption) {
    if (this.value !== opt.value) {
      this.value = opt.value;
      this.selected = <KuXSelectOption>this.optionsMapping[this.value] || { name: null, value: null };
      this.valueChange.emit(this.value);
    }
    this.selecting = false;
    this.isOpen = false;
  }
  ngOnInit() {
    this.optionsMapping = {};
    this.options.forEach((itm: KuXSelectOption) => {
      this.optionsMapping[itm.value] = itm;
    });
    switch (this.optwdith) {
      case 'full':
        this.optwdith = this.width;
        break;
      case 'min':
      case 'auto':
        this.optwdith = 'auto';
        break;
      default:
    }
  }
  writeValue(v: any) {
    if (v !== this.value) {
      this.value = v;
      if (this.optionsMapping) {
        this.selected = <KuXSelectOption>this.optionsMapping[v] || { name: null, value: null };
      }
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
  selector: 'kux-select-opt',
  template: `
      <div class="kux-select-opt-box" [ngStyle]="style">      
        <kux-scrollbar>
              <ul [ngStyle]="ulStyle">
                  <li *ngFor="let oneOpt of opt" (click)="select(oneOpt)">{{oneOpt.name}}</li>
              </ul>
        </kux-scrollbar>
      </div>
    `,
  styles: [
    ` 
      :host{
        display:block
      }
      li{
            list-style: none;
            text-indent: 12px;
            padding-right:12px;
            height:38px;
            line-height:38px;
            cursor: pointer;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        li:hover{
            background-color:#f7f7f7;
        }
        .kux-select-opt-box {
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.19);
            z-index: 1000;
            color: #333;
            font-size: 12px;
            padding: 4px 0;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
      `
  ]
})
export class KuXSelectOpt implements OnInit {
  @Input() public opt: KuXSelectOption[];
  @Input() public width: string;
  @Input() public maxHeight: string;
  @Output() public oncheck: EventEmitter<KuXSelectOpt> = new EventEmitter<KuXSelectOpt>(false);
  public style: any = {};
  public ulStyle: any = {};
  constructor() {
    this.opt = [];
  }
  select(opt: KuXSelectOpt) {
    this.oncheck.emit(opt);
  }
  ngOnInit() {
    this.ulStyle.width = this.style.width = this.width;
    if (this.maxHeight !== undefined) {
      this.style.height = this.maxHeight;
    }
  }
}