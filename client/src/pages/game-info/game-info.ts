import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { GameCreatePage } from '../game-create/game-create';

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
    // var title = navParams.data.gameTitle.trim();
    this.game = {
      "title": "Charterstone",
      "rating": "4.28",
      "minplayer": 2,
      "maxplayer": 6,
      "minplaytime": 5,
      "maxplaytime": 10,
      "yearpublished": 2002,
      "description": "hearthstone",
      "difficulty": "Advanced",
      "genre": [
        "Strategy"
      ],
      "publisher": [
        "Alary Games"
      ],
      "totalcopies": "0",
      "availablecopies": "0"
    };

    // this.http.get(API_URL + "/game-info/'" + title + "'").map(res => res.json()).subscribe(
    //   data => {
    //     this.game = data.data[0];
    //     console.log("game variable is: ");
    //     console.log(this.game);
    //   },
    //   err => {
    //     console.log("Oops!");
    //     console.log(err);
    //   }
    // );
  }

  editGame() {
    this.navCtrl.push('GameCreatePage', {
      currentActionDescription: "Edit a game",
      game: this.game,
      currentAction: "editingGame"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

}
