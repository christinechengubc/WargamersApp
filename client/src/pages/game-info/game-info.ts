import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { User } from '../../providers/providers';
import { GameEditPage } from '../game-edit/game-edit';
import { Api } from '../../providers/providers';
import { Storage } from "@ionic/storage";
import {HttpHeaders} from "@angular/common/http";
import {GamesPage} from "../games/games";

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
  login = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public user: User, public api: Api, public toastCtrl: ToastController, public events: Events, public storage: Storage, private alertCtrl: AlertController) {
    this.storage.get('token').then((token) => {
      this.token = token;
    });
    this.storage.get('login').then((login) => {
      this.login = login;
    });
  }

  editGame() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };

    this.api.get('login/', null, httpOptions).subscribe(
      resp => {
        this.navCtrl.push('GameEditPage', {
          game: this.game,
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
      }
    )
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
        this.storage.set('login', 0);
        let toast = this.toastCtrl.create({
          message: 'Failed to delete game from database. Error: not logged in',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.events.publish('refresh');
        this.navCtrl.setRoot(GamesPage);
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

  isLoggedIn() {
    return this.login;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

  ionViewWillEnter() {
    this.game = this.navParams.data.game;
  }
}
