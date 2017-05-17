import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  public total = 623;
  public limit = 50;
  public page = 0;
  
  showEvent(e){
    console.log(e)
  }
  constructor() { }

  ngOnInit() {
  }

}