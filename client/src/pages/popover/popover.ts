import { Component } from '@angular/core';
import {ViewController, NavController, NavParams, ToastController} from 'ionic-angular';
import { User } from '../../providers/providers';
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {
  login = 0;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public user: User, public storage: Storage, public toastCtrl: ToastController) {
    this.storage.get('login').then((login) => {
      this.login = login;
    });
  }

  clubInfo() {
    this.navCtrl.push('ClubInfoPage');
  }

  about() {
    this.navCtrl.push('AboutPage');
  }

  adminLogin() {
   this.navCtrl.push('LoginPage');
  }

  adminLogout() {
    this.storage.set('login',0);
    this.login = 0;
    this.storage.set('token', null);
    let toast = this.toastCtrl.create({
      message: 'Successfully logged out!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    this.navCtrl.setRoot(TabsPage);
  }


  isLoggedIn() {
    return this.login;
  }
}
