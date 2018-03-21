import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtr: PopoverController) {
  }

  presentPopover(event) {
    let popover = this.popoverCtr.create(PopoverPage);
    popover.present({
      ev: event
    });
  }

  gameInfo() {
    this.navCtrl.push('GameInfoPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesPage');
  }

}
