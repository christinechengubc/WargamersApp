import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Game} from "../../models/Game";
import {GameProvider} from "../../providers/providers";

@IonicPage()
@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
  games: Game[] = [];
  page: number = 0;
  infiniteScroll;
  game: Game;
  searchBy: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private gameProvider: GameProvider, private toastCtrl: ToastController) {
    if (this.navParams.get("game") != null) {
      this.game = this.navParams.get("game");
    }
    if (this.navParams.get("searchBy") != null) {
      this.searchBy = this.navParams.get("searchBy");
    }
    if (this.navParams.get("games") != null) {
      this.games = this.navParams.get("games");
    }
  }

  gameInfo(game) {
    this.navCtrl.push('GameInfoPage', {
      game: game
    });
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.page = this.page + 1;
    this.gameProvider.getFromSearch(this.game, this.searchBy, this.page).subscribe(
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
          for (let game of games) {
            this.games.push(game);
          }
        }
        infiniteScroll.complete();
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching searched games from API: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.games = [];
      }
    );
  }

}
