import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public ngOnInit() {
    console.log('Initial App');
  }
}


@Component({
  template: `<router-outlet></router-outlet>`
})
export class AppRouteComponent implements OnInit {
  public ngOnInit() {
    //套一层跟路由，利用这层可以先做一些判断以及检验再跳路由
  }
}