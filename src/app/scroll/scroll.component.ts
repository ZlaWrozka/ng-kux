import { Component, OnInit, ViewChild } from '@angular/core';
import { KuxScrollComponent } from '../../ng-kux/scroll/scroll.component';
import { KuxScrollStableComponent } from '../../ng-kux/scroll/scroll.stable.component'
@Component({
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.css'],
})
export class ScrollComponent implements OnInit {
  @ViewChild(KuxScrollComponent) kuxScroll: KuxScrollComponent
  @ViewChild(KuxScrollStableComponent) kuxScroll2: KuxScrollStableComponent
  private AllData: any = [];
  private AllData2: any = [];
  constructor(
  ) {
    for (let i = 0; i < 2003; i++) {
      this.AllData.push({
        id: i,
        name: `number${i}`
      })
    }
    for (let i = 0; i < 2003; i++) {
      this.AllData2.push({
        id: i,
        name: `number${i}`
      })
    }
  }
  $index(index) {
    return index;
  }
  byID(index, item) {
    return item.id;
  }
  byKuxIndex(index, item) {
    return item.$kuxindex
  }
  ngOnInit() {
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
    this.kuxScroll2.getData = (begin, length) => {
      let list = [];
      for (let i = begin; i < begin + length; i++) {
        let item = this.AllData2[i];
        if (item !== undefined) {
          list.push(item)
        }
      }
      return list
    }

  }

}