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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCreatePage');
  }

}
