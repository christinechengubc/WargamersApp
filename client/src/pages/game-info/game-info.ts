import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-info',
  templateUrl: 'game-info.html',
})
export class GameInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  editGame() {
    this.navCtrl.push('GameCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

}
