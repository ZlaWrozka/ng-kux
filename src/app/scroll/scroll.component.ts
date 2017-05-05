import { Component, OnInit, ViewChild } from '@angular/core';
import { KuxScrollComponent } from '../../ng-kux/scroll/scroll.component'
@Component({
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.css'],
})
export class ScrollComponent implements OnInit {
  @ViewChild(KuxScrollComponent) kuxScroll: KuxScrollComponent
  private AllData: any = [];
  constructor(
  ) {
    for (let i = 0; i <= 20000; i++) {
      this.AllData.push({
        id: i,
        name: `number:${i + 1}`
      })
    }
  }
  $index(index) {
    return index;
  }
  byID(index, item) {
    return item.id;
  }
  ngOnInit() {
    let num = 0;
    this.kuxScroll.getData = (begin, length) => {
      let list = [];
      for (let i = begin; i < begin + length; i++) {
        let item = this.AllData[i];
        if (item !== undefined) {
          list.push(item)
        }
      }
      return list
    }

  }

}