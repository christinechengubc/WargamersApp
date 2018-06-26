import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';

/**
 * Generated class for the eventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {

  event: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User) {
    this.event = navParams.data.event;
  }

  editEvent() {
    this.navCtrl.push('EventCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventInfoPage');
  }

}
