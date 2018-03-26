import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { API_URL } from '../url';
import { PopoverPage } from '../popover/popover';
import { Http } from '@angular/http';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtr: PopoverController, public http: Http) {
    this.http.get(API_URL + '/games').map(res => res.json()).subscribe(
      data => {
        this.games = data.data;
        console.log("now logging");
        console.log(data.data);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  presentPopover(event) {
    let popover = this.popoverCtr.create(PopoverPage);
    popover.present({
      ev: event
    });
  }

  gameInfo(gameTitle) {
    console.log("In games.ts the title is " + gameTitle);
    this.navCtrl.push('GameInfoPage', {
      gameTitle: gameTitle
    });
  }

  addGame() {
    this.navCtrl.push('GameCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesPage');
  }

}
