import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import {EventProvider, User} from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {Response} from "../../models/Response";

@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {

  event: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public toastCtrl: ToastController,
              public events: Events, public storage: Storage, private alertCtrl: AlertController, private eventProvider: EventProvider) {
    if (navParams.data.event != null) {
      this.event = navParams.data.event;
    }
  }

  editEvent() {
    this.navCtrl.push('EventCreatePage', {
      event: this.event,
      action: "Edit",
    });
  }

  deleteEvent(event: Event) {
    this.eventProvider.delete(event).subscribe(
      (res: Response) => {
        if (res.code === 200) {
          let message = res.message;
          if (res.result.event_count == 0) {
            message = "No event was deleted. Maybe it was previously deleted - try refreshing.";
          }
          let toast = this.toastCtrl.create({
            message: message,
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
          message: "Error deleting an event: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        error.present();
      }
    );
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
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteEvent(this.event);
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
