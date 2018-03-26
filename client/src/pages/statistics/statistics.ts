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

  }

  getEvent(attendance) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }

}
