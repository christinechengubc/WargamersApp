import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URL } from '../url';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  events: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    console.log(API_URL);
    this.http.get(API_URL + '/events').map(res => res.json()).subscribe(
      data => {
        this.events = data.data;
        console.log("now logging");
        console.log(data.data);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  eventInfo(name, date) {
    this.navCtrl.push('EventInfoPage', {
      eventName: name,
      eventDate: date
    });
  }

  addEvent() {
    this.navCtrl.push('EventCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
