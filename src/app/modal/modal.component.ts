import { Component, AfterViewInit } from '@angular/core';
import { KuxModalService } from '../../ng-kux/modal/modal.helper'
import { DialogComponent } from './dialog/dialog.component'
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit {
  private time: number = 0;
  constructor(
    private modal: KuxModalService
  ) {
  }
  openDemo() {
    this.time++;
    if (this.time > 5) {
      this.time = 0;
      return;
    }
    let modal = this.modal.open(DialogComponent, { zIndex: 1 });
    modal.subject.subscribe((e) => {
      if (e.action == '$close') {
        this.openDemo();
      }
    })
  }
  ngAfterViewInit() {
  }

}