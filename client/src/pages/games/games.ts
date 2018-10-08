import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {GameProvider} from '../../providers/providers';
import {Game} from "../../models/Game";
import {ToastController} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {
  games: Game[] = [];
  page: number = 0;
  infiniteScroll;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appEvents: Events, public gameProvider: GameProvider, public toastCtrl: ToastController) {
    this.getGamesFromCache();
    this.appEvents.subscribe("refreshGames",
      () => {
        this.getGamesFromCache();
      });
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
      (games: Game[]) => {
        if (this.infiniteScroll) this.infiniteScroll.enable(true);
        this.page = 0;
        this.games = games;
        refresher.complete();
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

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.page = this.page + 1;
    this.gameProvider.getAndAddToCache(this.page).subscribe(
      (games: Game[]) => {
        if (games.length === 0) {
          let lastPage = this.toastCtrl.create({
            message: "Last page reached.",
            duration: 500,
            position: 'bottom'
          });
          lastPage.present();
          infiniteScroll.enable(false);
        } else {
          this.games = games;
        }
        infiniteScroll.complete();
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching games from API: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.games = [];
      }
    );
  }
}
