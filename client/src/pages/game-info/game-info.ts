import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { GameCreatePage } from '../game-create/game-create';
import { Api } from '../../providers/providers';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController) {
    var title = navParams.data.gameTitle;
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
    this.navCtrl.push('GameCreatePage', {
      currentActionDescription: "Edit a game",
      game: this.game,
      currentAction: "editingGame"
    });
  }

  deleteGame() {
    this.api.delete('games/del/' + this.navParams.data.gameTitle).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully deleted game from database!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      },
      err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Failed to delete game from database. Error: ' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

  ionViewWillEnter() {
    var title = this.navParams.data.gameTitle;
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
}
