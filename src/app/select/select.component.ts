import { Component, OnInit } from '@angular/core';
@Component({
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  public options: any[] = [
    {
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
    }, {
      name: "第六项",
      value: 5
    }, {
      name: "第七项",
      value: 6
    }
  ];
  public selected = 1;
  constructor() {

  }

  ngOnInit() {
  }

}