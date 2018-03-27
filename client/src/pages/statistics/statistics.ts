import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';

/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  loadedGames: any = false;
  loadedEvents: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

  }

  getGame(rating) {
    this.http.get(API_URL + '/stats/game/' + rating).map(res => res.json()).subscribe(
      data => {
        this.loadedEvents = false;
        this.loadedGames = data.data;
        console.log("now logging");
        console.log(data.data);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  getEvent(attendance) {
    this.http.get(API_URL + '/stats/event/' + attendance).map(res => res.json()).subscribe(
      data => {
        this.loadedGames = false;
        this.loadedEvents = data.data;
        console.log("now logging");
        console.log(data.data);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }

}
