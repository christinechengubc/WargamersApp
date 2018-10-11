import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { SanitizerProvider } from '../../providers/providers';
import { Storage } from "@ionic/storage";

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-create',
  templateUrl: 'game-create.html',
})
export class GameCreatePage {

  token: string = null;
  game: any = {};
  title: string = "Terraforming Mars";
  SEARCH_URL = "https://www.boardgamegeek.com/xmlapi/search?search=";
  MOCK_DATA = ["Terraforming Mars", "Terraforming Mars: BGG User-Created Corporation Pack"];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController,  public sanitizer: SanitizerProvider, public storage: Storage, private alertCtrl: AlertController) {
    this.storage.get('token').then((token) => {
      this.token = token;
    });


  }

  presentAlert(inputs) {
    let alert = this.alertCtrl.create({
    title: 'Which game did you mean?',
    inputs: inputs,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK',
        handler: data => {
          console.log("Added game!")
        }
      }
    ]
    });
    alert.present();
  }

  getInputList(games) {
    let inputs = [];
    for (let game of games) {
      let input = {};
      input.type = 'radio';
      input.label = game;
      input.value = game;
      inputs.push(input);
    }
    return inputs;
  }

  next() {
    // get games hahaha
    let inputs = this.getInputList(this.MOCK_DATA);
    this.presentAlert(inputs);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameCreatePage');
  }

}
