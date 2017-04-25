import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  public planel: any = {
    min: new Date('2015/02/08'),
    max: new Date('2018/05/13'),
    date: new Date(),
    dateMonth: new Date(),
    dateYear: new Date(),
    today: new Date('2017/04/20')
  }
  public form: any = {
    min: new Date('2015/02/08'),
    max: new Date('2018/05/13'),
    date: new Date(),
    today: new Date('2017/04/20')
  }
  public test=  new Date();
  constructor() { }
  logDate(d: any) {
    console.log(d)
  }


}