import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URL } from '../url';
import { User } from '../../providers/providers';

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
  games: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public events: Events) {

    if (typeof navParams.data.games === 'undefined') {
      this.http.get(API_URL + '/games').map(res => res.json()).subscribe(
        data => {
          this.games = data.result.games;
        },
        err => {
        }
      );
    } else {
      this.games = navParams.data.games.result.games;
    }
  }

  gameInfo(game) {
    console.log("In games.ts the title is " + game);
    this.navCtrl.push('GameInfoPage', {
      game: game
    });
  }

  addGame() {
    this.navCtrl.push('GameCreatePage', {
      currentActionDescription: "Add a game",
      currentAction: "addingGame"
    });
  }

  doRefresh(refresher) {
    this.http.get(API_URL + '/games').map(res => res.json()).subscribe(
      data => {
        this.games = data.result.games;
        refresher.complete();
      },
      err => {
        refresher.complete();
      }
    );
  }

  searchGame() {
    this.navCtrl.push('SearchPage');
  }

  ionViewDidLoad() {

  }

}
