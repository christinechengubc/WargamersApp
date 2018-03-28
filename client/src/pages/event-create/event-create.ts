import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {

  execs: any = [];
  days: any = [];
  years: any = [];
  hours: any = [];
  minutes: any = [0,15,30,45];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.http.get(API_URL + "/event-create/execs").map(res => res.json()).subscribe(
      data => {
        this.execs = data.data;
        console.log(this.execs);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
    for (let h = 0; h <= 23; h++) {
      this.hours.push(h);
    }
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    let startYear = 1900;
    let endYear = 2018;
    for (let j = endYear; j >= startYear; j--) {
      this.years.push(j);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCreatePage');
  }

}
