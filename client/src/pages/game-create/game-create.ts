import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';

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

  publishers: any = [];
  genres: any = [];
  years: any = [];
  title: string = "test game"; // note that you don't actually have to declare this variable for ngModel to work, but I prefer to declare it for clarity that it exists in model
  rating: any = 3;
  minPlayers: any = 2;
  maxPlayers: any = 4;
  minPlaytime: any = 20;
  maxPlaytime: any = 40;
  difficulty: any = 'Beginner';
  yearPublished: any = 1998;
  description: any = 'lol';
  publishers_selected: any = ['Hasbro', 'Parker Bros'];
  genres_selected: any = ['Traditional', 'Strategy'];
  monthPurchased = '02'; // for ion-options, needs to be a string b/c value corresponds to a string
  yearPurchased = 2000;
  language: any = "English";


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController) {
    this.http.get(API_URL + "/game-create/publishers").map(res => res.json()).subscribe(
      data => {
        this.publishers = data.data;
        console.log(this.publishers);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );

    this.http.get(API_URL + "/game-create/genre").map(res => res.json()).subscribe(
      data => {
        this.genres = data.data;
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
    let startYear = 1900;
    let endYear = 2018;
    for (let i = startYear; i <= endYear; i++) {
      this.years.push(i);
    }
  }

  save() {
    let body: any = {
      title: this.title,
      rating: this.rating,
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
      minPlaytime: this.minPlaytime,
      maxPlaytime: this.maxPlaytime,
      yearPublished: this.yearPublished,
      description: this.description,
      difficulty: this.difficulty,
      publishers: this.publishers_selected,
      genres: this.genres_selected,
      language: this.language,
      datePurchased: this.yearPurchased + "-" + this.monthPurchased + "-01"
    }
    console.log(body);

    this.api.post('game-create/new', body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully posted game to database!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      },
      err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Failed to post game to database.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameCreatePage');
  }

}
