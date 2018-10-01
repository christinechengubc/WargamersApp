import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import {GameProvider, User} from '../../providers/providers';
import { GameEditPage } from '../game-edit/game-edit';
import { Api } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";
import {Response} from "../../models/Response";
import {Game} from "../../models/Game";

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

  game: Game;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public gameProvider: GameProvider,
              public events: Events, public storage: Storage, private alertCtrl: AlertController) {
    if (navParams.data.game != null) {
      this.game = navParams.data.game;
    }
  }

  editGame() {
    this.navCtrl.push('GameEditPage', {
      game: this.game
    });
  }

  deleteGame(game: Game) {
    this.gameProvider.delete(game).subscribe(
      (res: Response) => {
        if (res.code === 200) {
          let message = res.message;
          if (res.result.game_count == 0) {
            message = "No game was deleted. Maybe it was previously deleted - try refreshing.";
          }
          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.pop();
          this.events.publish('refreshGames');
        }
      },
      err => {
        let error = this.toastCtrl.create({
          message: "Error deleting a game: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
      }
    );
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Delete this game?',
      message: 'Do you really want to delete this game?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteGame(this.game);
          }
        }
      ]
    });
    alert.present();
  }
}
