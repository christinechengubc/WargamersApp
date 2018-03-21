import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
