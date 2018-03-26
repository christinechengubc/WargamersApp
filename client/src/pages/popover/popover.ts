import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {}

  close() {
    this.viewCtrl.dismiss();
  }

  statistics() {
    this.navCtrl.push('StatisticsPage');
  }
}
