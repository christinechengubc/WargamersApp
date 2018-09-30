import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { Api } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";
import {MainPage} from "../pages";
import {EventsPage} from "../events/events";

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
  token: any;
  login: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController, public events: Events, public storage: Storage, private alertCtrl: AlertController) {
    this.event = navParams.data.event;
    this.login = 0;
    this.storage.get('token').then((token) => {
      this.token = token;
    });
    this.storage.get('login').then((login) => {
      this.login = login;
    })
  }

  editEvent() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };

    this.api.get('login/', null, httpOptions).subscribe(
      resp => {
        this.navCtrl.push('EventCreatePage', {
          event: this.event,
          action: "Edit",
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
        this.navCtrl.setRoot(EventsPage);
      }
    )
  }

  deleteEvent() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    console.log("delete");
    this.api.delete('events/' + this.event.id, httpOptions).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully deleted event from database!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop();
        this.events.publish('refresh');

      },
      err => {
        console.log(err);
        this.storage.set('login', 0);
        let toast = this.toastCtrl.create({
          message: 'Failed to delete event from database. Error: not logged in',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(EventsPage);
      }
    )
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Delete this event?',
      message: 'Do you really want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteEvent();
          }
        }
      ]
    });
    alert.present();
  }

  isLoggedIn() {
    return this.login;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EventInfoPage');
  }

}
