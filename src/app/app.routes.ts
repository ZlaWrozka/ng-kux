import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppRouteComponent } from './app.component'
const APP_ROUTES: Routes = [
  {
    path: '', component: AppRouteComponent,
    children: [
      {
        path: 'select',
        loadChildren: './select#SelectModule'
      }, {
        path: 'scrollbar',
        loadChildren: './scrollBar#ScrollBarModule'
      },{
        path:'scroll',
        loadChildren:'./scroll#ScrollModule'
      }, {
        path: 'datepicker',
        loadChildren: './datepicker#DatepickerModule'
      },{
        path: 'pagination',
        loadChildren: './pagination#PaginationModule'
      }, {
        path: 'timepicker',
        loadChildren: './timepicker#TimepickerModule'
      }, {
        path: 'modal',
        loadChildren: './modal#ModalModule'
      }, {
        path: '**',
        redirectTo: 'select'
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }