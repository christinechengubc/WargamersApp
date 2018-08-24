import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/providers';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public user: User) {}

  clubInfo() {
    this.navCtrl.push('ClubInfoPage');
  }

  about() {
    this.navCtrl.push('AboutPage');
  }

  adminLogin() {
   this.navCtrl.push('LoginPage');
  }
}
