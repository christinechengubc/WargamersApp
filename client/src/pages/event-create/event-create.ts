import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import {ExecutiveProvider, EventProvider, Validator} from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {Response} from "../../models/Response";
import {Executive} from "../../models/Executive";
import {Event} from '../../models/Event';

@IonicPage()
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {

  MIN_YEAR = new Date(Date.now()).getFullYear();
  MAX_YEAR = this.MIN_YEAR + 2;

  event: Event = new Event();
  executives: Executive[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, public execProvider: ExecutiveProvider,
    public toastCtrl: ToastController, public events: Events, public validator: Validator, public storage: Storage) {
    if (this.navParams.data.action === "Edit" && navParams.data.event != null) {
      this.event = navParams.data.event;
    }
    this.getExecs();
  }

  getExecs() {
    this.execProvider.getFromCache().subscribe(
      (executives: Executive[]) => {
        this.executives = executives;
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching executives from cache: " + err,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.executives = [];
      }
    );
  }

  save() {
    this.fillEventWithDefault();

    let check = this.validator.checkEventBody(this.event);
    if (check != "") {
      let error = this.toastCtrl.create({
        message: check,
        duration: 3000,
        position: 'top'
      });
      error.present();
      return;
    }

    if (this.navParams.data.action === "Edit") {
      this.editEvent(this.event);
    } else if (this.navParams.data.action === "Create") {
      this.createEvent(this.event);
    }
  }

  fillEventWithDefault() {
    if (this.event.always_show == null) {
      this.event.always_show = false;
    }
    if (this.event.location === "") {
      this.event.location = "TBA";
    }
    if (this.event.description === "") {
      this.event.description = "N/A";
    }
    if (this.event.fb_event_page === "") {
      this.event.fb_event_page = "N/A";
    }
  }

  editEvent(event: any) {
    this.eventProvider.put(event).subscribe(
      (res: Response) => {
        if (res.code === 200) {
          let message = res.message;
          if (res.result.event_count == 0) {
            message = "No event was updated. Maybe it was previously deleted - try refreshing.";
          }
          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.pop();
        }
      },
      err => {
        let error = this.toastCtrl.create({
          message: "Error editing an event: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
      }
    );
  }

  createEvent(event: any) {
    this.eventProvider.post(event).subscribe(
      (res: Response) => {
        if (res.code === 200) {
          let toast = this.toastCtrl.create({
            message: res.message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.pop();
          this.events.publish('refreshEvents');
        }
      },
      err => {
        let error = this.toastCtrl.create({
          message: "Error posting an event: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
      }
    );
  }
}
