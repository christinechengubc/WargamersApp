import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { ValidatorProvider } from '../../providers/providers';
import { Storage } from "@ionic/storage";
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

  MIN_YEAR = new Date(Date.now()).getFullYear();
  MAX_YEAR = this.MIN_YEAR + 2;

  token: string = null;
  event: any = {};
  action: any;
  execs: any = [];

  date: string;
  start_time: string;
  end_time: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController, public events: Events, public validator: ValidatorProvider, public storage: Storage) {
    this.http.get(API_URL + "/executives").map(res => res.json()).subscribe(
      data => {
        this.execs = data.result.executives;
      },
      err => {

      }
    );

    this.storage.get('token').then((token) => {
      this.token = token;
    });

    if (navParams.data.event != null) {
      this.event = navParams.data.event;
      this.date = this.event.date;
      this.start_time = this.event.start_time;
      this.end_time = this.event.end_time;
    }
    if (navParams.data.action != null) {
      this.action = navParams.data.action;
    }
  }

  save() {
    if (this.event.always_show == null) {
      this.event.always_show = false;
    }

    let body: any = {
      title: this.event.title,
      date: this.date,
      description: this.event.description,
      start_time: this.start_time,
      end_time: this.end_time,
      location: this.event.location,
      always_show: this.event.always_show,
      lead_exec: this.event.lead_exec,
      fb_event_page: this.event.fb_event_page,
      image: this.event.image,
      token: this.token
    };

    let check = this.validator.checkEventBody(body);
    if (check != "") {
      let error = this.toastCtrl.create({
        message: check,
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.action === "Edit") {
      this.editEvent(body);
    } else if (this.action === "Create") {
      this.createEvent(body);
    }
  }

  editEvent(body: any) {
    this.api.put('events/' + this.event.id, body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully edited event!',
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
          message: 'Failed to edit event. ' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }

  createEvent(body: any) {
    this.api.post('events', body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully created event!',
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
          message: 'Failed to create event. ' + err.error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCreatePage');
  }

}
