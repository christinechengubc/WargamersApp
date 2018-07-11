import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URL } from '../url';
import { User } from '../../providers/providers';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User) {
    console.log(API_URL);
    this.http.get(API_URL + '/events').map(res => res.json()).subscribe(
      data => {
        this.events = data.result.events;
        console.log("now logging");
        console.log(data.result.events);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  eventInfo(event) {
    this.navCtrl.push('EventInfoPage', {
      event: event,
    });
  }

  addEvent() {
    this.navCtrl.push('EventCreatePage', {
      action: "Create",
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
