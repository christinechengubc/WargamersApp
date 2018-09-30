import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { SanitizerProvider } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {EventsPage} from "../events/events";

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

  token: string = null;
  event: any = {};
  action: any;
  execs: any = [];
  days: any = [];
  years: any = [];
  hours: any = [];
  minutes: any = [0,15,30,45];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController, public events: Events, public sanitizer: SanitizerProvider, public storage: Storage) {
    this.http.get(API_URL + "/executives").map(res => res.json()).subscribe(
      data => {
        this.execs = data.result.executives;
        console.log(this.execs);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );

    this.storage.get('token').then((token) => {
      this.token = token;
    });

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
    console.log(navParams.data);
    if (navParams.data.event != null) {
      this.event = navParams.data.event;
    }
    if (navParams.data.action != null) {
      this.action = navParams.data.action;
    }

  }

  getDate() {
    // TODO: output correct date format
  }

  getStartTime() {
    // TODO: output correct start time format
  }

  getEndTime() {
    // TODO: output correct end time format
  }

  save() {
    let date = this.getDate();
    let start_time = this.getStartTime();
    let end_time = this.getEndTime();
    if (this.event.always_show == null) {
      this.event.always_show = false;
    }

    let body: any = {
      title: this.event.title,
      date: date,
      description: this.event.description,
      start_time: start_time,
      end_time: end_time,
      location: this.event.location,
      always_show: this.event.always_show,
      lead_exec: this.event.lead_exec,
      fb_event_page: this.event.fb_event_page,
      image: this.event.image,
      token: this.token
    };


    if (this.action === "Edit") {
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
          this.storage.set('login', 0);
          let toast = this.toastCtrl.create({
            message: 'Failed to edit event. Error: not logged in',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.setRoot(EventsPage);

        }
      );
    }

    if (this.action === "Create") {
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
          this.storage.set('login', 0);
          let toast = this.toastCtrl.create({
            message: 'Failed to create event. Error: not logged in',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.setRoot(EventsPage);
        }
      );
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCreatePage');
  }

}
