# NG-KuX    UI Component For Angular4

---

## Select
#### In NgModule
``` typescript
import { KuxSelectModule } from 'ng-kux';
@NgModule({
  imports: [
    KuxSelectModule
    ,...
  ],
  declarations: [...]
})
export class SomeModule { }
```

#### In Component Template
``` html
<kux-select [(ngModel)]="selected" [options]="options"></kux-select>
```
#### In Component
``` typescript
export class SomeComponent{

    public selected = -1;
    
    public options:any[]=[
        {
            name: "选择下面一项",
            value: -1
        }, {
            name: "第一项",
            value: 0
        }, {
            name: "第二项",
            value: 1
        }, {
            name: "第三项",
            value: 2
        }, {
            name: "第四项",
            value: 3
        }, {
            name: "第五项",
            value: 4
        }
    ]
}
```
#### Optional Parameters
Param       | Type    | Default | description
------------|---------|---------|-------------------
width       | string  | 205px   | select wdith
optwdith    | string  | 205px   | option width
maxHeight   | string  | null    | option max height
placeholder | string  | null    | you know it
disabled    | boolean | false   | you know it

---

## ScrollBar
#### In NgModule
``` typescript
import { KuxScrollBarModule } from 'ng-kux';
@NgModule({
  imports: [
    KuxScrollBarModule
    ,...
  ],
  declarations: [...],
  ...
})
export class SomeModule { }
```

#### In Component Template
``` html
<kux-scrollbar [autoHide]="true">
    ...
</kux-scrollbar>
```
#### Optional Parameters
Param    | Type    | Default | description
---------|---------|---------|--------------------------
autoHide | boolean | true    | auto hide x&y scroll bar

#### In Parant Component You Can...
``` typescript
import { KuxScrollbarComponent } from 'ng-kux';
@Component({...})
export class ParentComponent implements  AfterViewInit {
    @ViewChild(KuxScrollbarComponent) private scrollBox: KuxScrollbarComponent
    constructor() { }
    ngAfterViewInit() {

        this.scrollBox.scrollTop=100;           //set scrollTop 
        console.log(this.scrollBox.scrollTop);  //get scrollTop

        this.scrollBox.scrollLeft=100;          //set scrollLeft
        console.log(this.scrollBox.scrollLeft); //get scrollLeft

        this.scrollBox.isScrollToBottom();      //is scroll box scroll to the bottom
        this.scrollBox.isScrollToRight();       //is scroll box scroll to the right

        this.scrollBox.refresh();               //refresh scroll bar
    }
}
```

---

## Datepicker
#### In NgModule
```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KuxDatepickerModule } from 'ng-kux';
@NgModule({
  imports: [
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    KuxDatepickerModule
    ,...
  ],
  declarations: [...],
  ...
})
export class SomeModule { }
```

#### In Component Template
```html
<kux-datepicker [(ngModel)]="data" [panleFmt]="'yyyy年M月d日'" [fmt]="'yyyy-M-d'" [placement]="['bottom','left']" [min]="min" [max]="max" [step]="3"></kux-datepicker>
```


#### Optional Parameters
Param    | Type   | Default    | description
---------|--------|------------|-----------------------------
disabled| boolean| false|you know it
panleFmt | string | MM/dd/yyyy | format Date on panle
fmt      | string | MM/dd/yyyy | format Date on form element
placement|string \| Array|['bottom','left'] | panle placement -bottom \| top \| left \| right
min|Date|null|Minimum allowed date for selection
max|Date|null|Maximum allowed date for selection
step|Number|3|3-pickday 2-pickmonth 1-pickyear
