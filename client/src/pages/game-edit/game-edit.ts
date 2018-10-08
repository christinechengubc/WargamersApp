import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import {GameProvider, Validator} from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {Game} from "../../models/Game";
import {Response} from "../../models/Response";


@IonicPage()
@Component({
  selector: 'page-game-edit',
  templateUrl: 'game-edit.html',
})
export class GameEditPage {

  game: Game;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public events: Events, public validator: Validator, public storage: Storage,
              public gameProvider: GameProvider) {
    if (navParams.data.game != null) {
      this.game = navParams.data.game;
    }
  }

  save() {
    this.fillGameWithDefault();

    let check = this.validator.checkGameBody(this.game);
    if (check != "") {
      let error = this.toastCtrl.create({
        message: check,
        duration: 3000,
        position: 'top'
      });
      error.present();
      return;
    }
    this.editGame(this.game);
  }

  fillGameWithDefault() {
    if (this.game.show_main_page == null) {
      this.game.show_main_page = false;
    }
    if (this.game.category == null || this.game.category  === "") {
      this.game.category = "N/A";
    }
    if (this.game.rating == null || Number(this.game.rating) === 0) {
      this.game.rating = 0;
    }
    if (this.game.complexity == null || Number(this.game.complexity) === 0) {
      this.game.complexity = 0;
    }
    if (this.game.description == null || this.game.description === "") {
      this.game.description = "N/A"
    }
    if (this.game.condition == null || this.game.condition  === "") {
      this.game.condition = "N/A"
    }
    if (this.game.expansion_of == null || this.game.expansion_of  === "") {
      this.game.expansion_of = "N/A"
    }
  }

  editGame(game: any) {
    this.gameProvider.put(game).subscribe(
      (res: Response) => {
        if (res.code === 200) {
          let message = res.message;
          if (res.result.game_count == 0) {
            message = "No game was updated. Maybe it was previously deleted - try refreshing.";
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
          message: "Error editing a game: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
      }
    );
  }
}
