import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-create',
  templateUrl: 'game-create.html',
})
export class GameCreatePage {

  publishers: any = [];
  genres: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.http.get(API_URL + "/game-create/publishers").map(res => res.json()).subscribe(
      data => {
        this.publishers = data.data;
        console.log(this.publishers);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
    this.http.get(API_URL + "/game-create/genre").map(res => res.json()).subscribe(
      data => {
        this.genres = data.data;
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameCreatePage');
  }

}
