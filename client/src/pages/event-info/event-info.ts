import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { Api } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";

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


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController, public events: Events, public storage: Storage, private alertCtrl: AlertController) {
    this.event = navParams.data.event;
    this.storage.get('token').then((token) => {
      this.token = token;
    })
  }

  editEvent() {
    this.navCtrl.push('EventCreatePage', {
      event: this.event,
      action: "Edit",
    });
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
        let toast = this.toastCtrl.create({
          message: 'Failed to delete event from database. Error: ' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventInfoPage');
  }

}
