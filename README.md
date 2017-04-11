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
|Param          |Type   |Default    | description   |
----------------|-------|-----------|---------------
width           |string |205px      |select wdith
optwdith        |string |205px      |option width
placeholder     |string |null       |you know it