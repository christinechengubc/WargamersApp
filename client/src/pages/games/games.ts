import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {GameProvider, User} from '../../providers/providers';
import {Game} from "../../models/Game";
import {ToastController} from "ionic-angular";
import {Response} from "../../models/Response";

@IonicPage()
@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {
  games: Game[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public appEvents: Events, public gameProvider: GameProvider, public toastCtrl: ToastController) {
    this.getGamesFromCache();
    this.appEvents.subscribe("refreshGames",
      () => {
        this.getGamesFromCache();
      }
    )
  }

  getGamesFromCache() {
    this.gameProvider.getFromCache().subscribe(
      (games: Game[]) => {
        this.games = games;
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching games from cache: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.games = [];
      }
    );
  }

  doRefresh(refresher) {
    this.gameProvider.getAndStoreInCache().subscribe(
      (res: Response) => {
        if (res.code === 200) {
          this.games = res.result.games;
          refresher.complete();
        }
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching games from API: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.games = [];
        refresher.complete();
      }
    );
  }

  gameInfo(game) {
    this.navCtrl.push('GameInfoPage', {
      game: game
    });
  }

  // addGame() {
  //   this.navCtrl.push('GameCreatePage', {
  //     currentActionDescription: "Add a game",
  //     currentAction: "addingGame"
  //   });
  // }


  searchGame() {
    this.navCtrl.push('SearchPage');
  }
}
