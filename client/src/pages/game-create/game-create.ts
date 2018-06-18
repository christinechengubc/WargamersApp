import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { API_URL } from '../url';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { SanitizerProvider } from '../../providers/providers';


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

  currentActionDescription: string;
  publishers: any = [];
  genres: any = [];
  years: any = [];
  isAddingGame: any = false;
  isEditingGame: any = false;
  title: any;
  rating: any;
  minPlayers: any;
  maxPlayers: any;
  minPlaytime: any;
  maxPlaytime: any;
  yearPublished: any;
  description: any;
  difficulty: any;
  publishers_selected: any;
  genres_selected: any;
  language: any;
  yearPurchased: any;
  monthPurchased: any;x


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController, public events: Events, public sanitizer: SanitizerProvider) {
    this.currentActionDescription = navParams.data.currentActionDescription;
    if (navParams.data.game != null) this.fillInGivenGameInfo(navParams.data.game);
    if (navParams.data.currentAction == "addingGame") this.isAddingGame = true;
    if (navParams.data.currentAction == "editingGame") this.isEditingGame = true;
    console.log(this.isEditingGame);

    // this.title = "test game"; // note that you don't actually have to declare this variable for ngModel to work, but I prefer to declare it for clarity that it exists in model
    // this.rating = 3;
    // this.minPlayers = 2;
    // this.maxPlayers = 4;
    // this.minPlaytime = 20;
    // this.maxPlaytime = 40;
    // this.difficulty = 'Beginner';
    // this.yearPublished = 1998;
    // this.description = 'lol';
    // this.publishers_selected = ['Hasbro', 'Parker Bros'];
    // this.genres_selected = ['Traditional', 'Strategy'];
    // this.monthPurchased = '02'; // for ion-options, needs to be a string b/c value corresponds to a string
    // this.yearPurchased = 2000;
    // this.language = "English";

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

  fillInGivenGameInfo(game: any) {
    this.title = game.title;
    this.rating = game.rating;
    this.minPlayers = game.minplayer;
    this.maxPlayers = game.maxplayer;
    this.minPlaytime = game.minplaytime;
    this.maxPlaytime = game.maxplaytime;
    this.difficulty = game.difficulty;
    this.yearPublished = game.yearpublished;
    this.description = game.description;
    this.publishers_selected = game.publisher;
    this.genres_selected = game.genre;
  }

  // Add a game
  add() {
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

    var integers = [this.rating, this.minPlayers, this.maxPlayers, this.minPlaytime, this.maxPlaytime];
    var values = [this.title, this.rating, this.minPlayers, this.maxPlayers, this.minPlaytime, this.maxPlaytime];
    if (!this.sanitizer.checkIfInput(values)) {
      let error = this.toastCtrl.create({
        message: 'Include an input!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (!this.sanitizer.checkIfIntegersOnlyIncludeNumerical(integers)) {
      let error = this.toastCtrl.create({
        message: 'Integers must only include numerical!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (!this.sanitizer.checkIfIntegersArePositive(integers)) {
      let error = this.toastCtrl.create({
        message: 'You cannot provide negative numbers!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.rating < 0 || this.rating > 5) {
      let error = this.toastCtrl.create({
        message: 'Rating must be between 0 and 5!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.minPlayers > this.maxPlayers) {
      let error = this.toastCtrl.create({
        message: 'minPlayers has to be less than maxPlayers!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.minPlaytime > this.maxPlaytime) {
      let error = this.toastCtrl.create({
        message: 'minPlaytime has to be less than maxPlaytime!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else {
      this.api.post('game-create/new', body).subscribe(
        resp => {
          console.log(resp);
          let toast = this.toastCtrl.create({
            message: 'Succesfully posted game to database!',
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
            message: 'Failed to post game to database. Error: ' + err.error.detail,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      )
    }
  }

  // Edit a game
  edit() {
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
    }
    console.log(body);
    console.log(this.rating);

    var integers = [this.rating, this.minPlayers, this.maxPlayers, this.minPlaytime, this.maxPlaytime];
    var values = [this.title, this.rating, this.minPlayers, this.maxPlayers, this.minPlaytime, this.maxPlaytime];

    if (!this.sanitizer.checkIfInput(values)) {
      let error = this.toastCtrl.create({
        message: 'Include an input!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (!this.sanitizer.checkIfIntegersOnlyIncludeNumerical(integers)) {
      let error = this.toastCtrl.create({
        message: 'Integers must only include numerical!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (!this.sanitizer.checkIfIntegersArePositive(integers)) {
      let error = this.toastCtrl.create({
        message: 'You cannot provide negative numbers!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.rating < 0 || this.rating > 5) {
      let error = this.toastCtrl.create({
        message: 'Rating must be between 0 and 5!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.minPlayers > this.maxPlayers) {
      let error = this.toastCtrl.create({
        message: 'minPlayers has to be less than maxPlayers!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.minPlaytime > this.maxPlaytime) {
      let error = this.toastCtrl.create({
        message: 'minPlaytime has to be less than maxPlaytime!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else {
    this.api.put('games/edit', body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully edited game!',
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
          message: 'Failed to edit game. Error: ' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameCreatePage');
  }

}
