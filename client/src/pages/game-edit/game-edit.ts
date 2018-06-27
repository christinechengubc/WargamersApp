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
  selector: 'page-game-edit',
  templateUrl: 'game-edit.html',
})
export class GameEditPage {

  id: any;
  category: any;
  title: any;
  rating: any;
  min_players: any;
  max_players: any;
  min_playtime: any;
  max_playtime: any;
  year_published: any;
  description: any;
  complexity: any;
  publisher: any;
  available_copies: any;
  total_copies: any;
  condition: any;
  expansion_of: any;
  show_main_page: any;
  thumbnail: any;
  image: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public api: Api, public toastCtrl: ToastController, public events: Events, public sanitizer: SanitizerProvider) {
    if (navParams.data.game != null) {
      this.fillInGivenGameInfo(navParams.data.game);
    }

    // this.title = "test game"; // note that you don't actually have to declare this variable for ngModel to work, but I prefer to declare it for clarity that it exists in model
    // this.rating = 3;
    // this.min_players = 2;
    // this.max_players = 4;
    // this.min_playtime = 20;
    // this.max_playtime = 40;
    // this.complexity = 'Beginner';
    // this.year_published = 1998;
    // this.description = 'lol';
    // this.publishers_selected = ['Hasbro', 'Parker Bros'];
    // this.categorys_selected = ['Traditional', 'Strategy'];
    // this.monthPurchased = '02'; // for ion-options, needs to be a string b/c value corresponds to a string
    // this.yearPurchased = 2000;
    // this.language = "English";
  }

  fillInGivenGameInfo(game: any) {
    this.id = game.id;
    this.title = game.title;
    this.rating = game.rating;
    this.min_players = game.min_players;
    this.max_players = game.max_players;
    this.min_playtime = game.min_playtime;
    this.max_playtime = game.max_playtime;
    this.complexity = game.complexity;
    this.year_published = game.year_published;
    this.description = game.description;
    this.publisher = game.publisher;
    this.category = game.category;
    this.available_copies = game.available_copies;
    this.total_copies = game.total_copies;
    this.condition = game.condition;
    this.expansion_of = game.expansion_of;
    this.show_main_page = game.show_main_page;
    this.thumbnail = game.thumbnail;
    this.image = game.image;
  }

  // Edit a game
  save() {
    let body: any = {
      title: this.title,
      rating: this.rating,
      min_players: this.min_players,
      max_players: this.max_players,
      min_playtime: this.min_playtime,
      max_playtime: this.max_playtime,
      year_published: this.year_published,
      description: this.description,
      complexity: this.complexity,
      publisher: this.publisher,
      category: this.category,
      available_copies: this.available_copies,
      total_copies: this.total_copies,
      condition: this.condition,
      expansion_of: this.expansion_of,
      show_main_page: this.show_main_page,
      thumbnail: this.thumbnail,
      image: this.image
    }

    var integers = [this.min_players, this.max_players, this.min_playtime, this.max_playtime, this.year_published, this.available_copies, this.total_copies];
    var values = [this.title, this.min_players, this.max_players, this.min_playtime, this.max_playtime, this.available_copies, this.total_copies];
    var positives = [this.rating, this.min_players, this.max_players, this.min_playtime, this.max_playtime, this.year_published, this.complexity, this.available_copies, this.total_copies];

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
    } else if (!this.sanitizer.checkIfPositive(positives)) {
      let error = this.toastCtrl.create({
        message: 'You cannot provide negative numbers!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.rating < 0 || this.rating > 10) {
      let error = this.toastCtrl.create({
        message: 'Rating must be between 0 and 10!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.complexity < 0 || this.complexity > 5) {
      let error = this.toastCtrl.create({
        message: 'Complexity must be between 0 and 5!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.min_players > this.max_players) {
      let error = this.toastCtrl.create({
        message: 'Minimum players cannot be greater than maximum players!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.min_playtime > this.max_playtime) {
      let error = this.toastCtrl.create({
        message: 'Minimum play time cannot be greater than maximum play time!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else if (this.available_copies > this.total_copies) {
      let error = this.toastCtrl.create({
        message: 'Available copies cannot be greater than total copies!',
        duration: 3000,
        position: 'top'
      });
      error.present();
    } else {
    this.api.put('games/' + this.id, body).subscribe(
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

  // // Add a game
  // add() {
  //   let body: any = {
  //     title: this.title,
  //     rating: this.rating,
  //     min_players: this.min_players,
  //     max_players: this.max_players,
  //     min_playtime: this.min_playtime,
  //     max_playtime: this.max_playtime,
  //     year_published: this.year_published,
  //     description: this.description,
  //     complexity: this.complexity,
  //     publishers: this.publishers_selected,
  //     categorys: this.categorys_selected,
  //     language: this.language,
  //     datePurchased: this.yearPurchased + "-" + this.monthPurchased + "-01"
  //   }
  //   console.log(body);
  //
  //   var integers = [this.rating, this.min_players, this.max_players, this.min_playtime, this.max_playtime];
  //   var values = [this.title, this.rating, this.min_players, this.max_players, this.min_playtime, this.max_playtime];
  //   if (!this.sanitizer.checkIfInput(values)) {
  //     let error = this.toastCtrl.create({
  //       message: 'Include an input!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else if (!this.sanitizer.checkIfIntegersOnlyIncludeNumerical(integers)) {
  //     let error = this.toastCtrl.create({
  //       message: 'Integers must only include numerical!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else if (!this.sanitizer.checkIfIntegersArePositive(integers)) {
  //     let error = this.toastCtrl.create({
  //       message: 'You cannot provide negative numbers!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else if (this.rating < 0 || this.rating > 5) {
  //     let error = this.toastCtrl.create({
  //       message: 'Rating must be between 0 and 5!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else if (this.min_players > this.max_players) {
  //     let error = this.toastCtrl.create({
  //       message: 'min_players has to be less than max_players!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else if (this.min_playtime > this.max_playtime) {
  //     let error = this.toastCtrl.create({
  //       message: 'min_playtime has to be less than max_playtime!',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     error.present();
  //   } else {
  //     this.api.post('game-edit/new', body).subscribe(
  //       resp => {
  //         console.log(resp);
  //         let toast = this.toastCtrl.create({
  //           message: 'Succesfully posted game to database!',
  //           duration: 3000,
  //           position: 'top'
  //         });
  //         toast.present();
  //         this.navCtrl.pop();
  //         this.events.publish('refresh');
  //       },
  //       err => {
  //         console.log(err);
  //         let toast = this.toastCtrl.create({
  //           message: 'Failed to post game to database. Error: ' + err.error.detail,
  //           duration: 3000,
  //           position: 'top'
  //         });
  //         toast.present();
  //       }
  //     )
  //   }
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameEditPage');
  }

}
