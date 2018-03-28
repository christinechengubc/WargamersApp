import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';

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

  game: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User) {
    var title = navParams.data.gameTitle.trim();
    this.http.get(API_URL + "/game-info/'" + title + "'").map(res => res.json()).subscribe(
      data => {
        this.game = data.data[0];
        console.log("game variable is: ");
        console.log(this.game);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  editGame() {
    this.navCtrl.push('GameCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

}
