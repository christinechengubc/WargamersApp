import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Game} from "../../models/Game";
import {GameProvider} from "../../providers/providers";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  game: Game = new Game();
  searchBy: any = 'basic';

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public gameProvider: GameProvider, public appEvents: Events) { }

  search() {
    if (!this.game.title) {
      let toast = this.toastCtrl.create({
        message: 'Please specify a title.',
        duration: 1000,
        position: 'top'
      });
      toast.present();
      return;
    }

    this.gameProvider.getFromSearch(this.game, this.searchBy, 0).subscribe(
      (games: Game[]) => {
        this.navCtrl.push('SearchResultsPage', {
          game: this.game,
          searchBy: this.searchBy,
          games: games
        });
      },
      (err) => {
        let toast = this.toastCtrl.create({
          message: 'Error while searching for game in database.' + err.error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

}
