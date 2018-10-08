import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { EventProvider, User} from '../../providers/providers';
import { Response } from "../../models/Response";
import {Events} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: Event[] = [];

  constructor(public navCtrl: NavController, public eventProvider: EventProvider, public user: User, public toastCtrl: ToastController, public appEvents: Events) {
    this.getEventsFromCache();
    this.appEvents.subscribe("refreshEvents",
      () => {
        this.getEventsFromCache();
      }
    )
  }

  getEventsFromCache() {
    this.eventProvider.getFromCache().subscribe(
      (events: Event[]) => {
        this.events = events;
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching events from cache: " + err,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.events = [];
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
    this.eventProvider.getAndStoreInCache().subscribe(
      (res: Response) => {
        if (res.code === 200) {
          this.events = res.result.events;
          refresher.complete();
        }
      },
      (err: any) => {
        let error = this.toastCtrl.create({
          message: "Error with fetching events from API: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
        this.events = [];
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
}
