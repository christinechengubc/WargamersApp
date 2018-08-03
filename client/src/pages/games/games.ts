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
          console.log("now logging");
          console.log(data.result.games);
        },
        err => {
          console.log("Oops!");
          console.log(err);
        }
      );
    } else {
      console.log(navParams.data.games);
      this.games = navParams.data.games.result.games;
      console.log(this.games);
    }

    events.subscribe('refresh', () => {
      this.http.get(API_URL + '/games').map(res => res.json()).subscribe(
        data => {
          this.games = data.data;

        },
        err => {

        }
      );
    });
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

  searchGame() {
    this.navCtrl.push('SearchPage');
  }

  ionViewDidLoad() {

  }

}
