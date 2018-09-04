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
      category: this.category,
      available_copies: this.available_copies,
      total_copies: this.total_copies,
      condition: this.condition,
      expansion_of: this.expansion_of,
      show_main_page: this.show_main_page,
      thumbnail: this.thumbnail,
      image: this.image
    };

    if (this.sanitizer.checkGameBody(body) != "") {
      let error = this.toastCtrl.create({
        message: this.sanitizer.checkGameBody(body),
        duration: 3000,
        position: 'top'
      });
      error.present();
      return;
    }

    this.api.put('games/' + this.id, body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Successfully edited game!',
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad GameEditPage');
  }

}
