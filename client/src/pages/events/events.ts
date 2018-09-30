import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URL } from '../url';
import { User } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";
import { Api } from '../../providers/providers';

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
  login = 0;
  token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController, public storage: Storage) {
    console.log(API_URL);
    this.http.get(API_URL + '/events').map(res => res.json()).subscribe(
      data => {
        this.events = data.result.events;

      },
      err => {

      }
    );

    this.storage.get('token').then((token) => {
      this.token = token;
    });

    this.storage.get('login').then((login) => {
      this.login = login;
    })
  }

  doRefresh(refresher) {
    this.http.get(API_URL + '/events').map(res => res.json()).subscribe(
      data => {
        this.events = data.result.events;
        refresher.complete();
      },
      err => {
        refresher.complete();
      }
    );
  }

  eventInfo(event) {
    this.navCtrl.push('EventInfoPage', {
      event: event,
    });
  }

  addEvent() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };

    this.api.get('login/', null, httpOptions).subscribe(
      resp => {
        this.navCtrl.push('EventCreatePage', {
          action: "Create",
        });
      },
      err => {
        this.storage.set('login', 0);
        let toast = this.toastCtrl.create({
          message: 'Cannot edit game. Error: not logged in',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('EventsPage');
      }
    )
  }

  isLoggedIn() {
    return this.login;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
