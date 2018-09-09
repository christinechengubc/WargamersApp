import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { GameEditPage } from '../game-edit/game-edit';
import { Api } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-info',
  templateUrl: 'game-info.html',
})
export class GameInfoPage {

  game: any = {};
  token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController, public events: Events, public storage: Storage, private alertCtrl: AlertController) {
    this.storage.get('token').then((token) => {
      this.token = token;
    })
  }

  editGame() {
    this.navCtrl.push('GameEditPage', {
      game: this.game,
    });
  }

  deleteGame() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    this.api.delete('games/' + this.game.id, httpOptions).subscribe(
      resp => {

        let toast = this.toastCtrl.create({
          message: 'Succesfully deleted game from database!',
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
          message: 'Failed to delete game from database. Error: ' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Delete this game?',
      message: 'Do you really want to delete this game?',
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
            this.deleteGame();
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

  ionViewWillEnter() {
    this.game = this.navParams.data.game;
  }
}
