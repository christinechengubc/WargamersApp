import { Component } from '@angular/core';
import {ViewController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";
import {LoginProvider} from "../../providers/providers";
import {MainPage} from "../pages";

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController,
              public loginProvider: LoginProvider) {
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
    this.loginProvider.logout();
    let toast = this.toastCtrl.create({
      message: 'Successfully logged out!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    this.navCtrl.push(MainPage);
  }
}
