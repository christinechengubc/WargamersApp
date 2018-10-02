import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchBy: any = 'basic';
  title: any;
  min_players: any;
  max_players: any;
  min_playtime: any;
  max_playtime: any;
  available: any;
  category: any;
  rating: any;
  year_published: any;
  description: any;
  complexity: any;
  condition: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toastCtrl: ToastController) { }

  search() {
    if (!this.title) {
      let toast = this.toastCtrl.create({
        message: 'Please specify a title.',
        duration: 1000,
        position: 'top'
      });
      toast.present();
      return
    }

    let body: any = {};
    body.title = this.title;
    body.available = this.available;
    if (body.available == null) {
      body.available = false;
    }

    if (this.searchBy === 'advanced') {
      body.min_players = this.min_players;
      body.max_players = this.max_players;
      body.min_playtime = this.min_playtime;
      body.max_playtime = this.max_playtime;
      body.category = this.category;
      body.rating = this.rating;
      body.year_published = this.year_published;
      body.description = this.description;
      body.complexity = this.complexity;
      body.condition = this.condition;
    }


    this.api.post('search/' + this.searchBy, body).subscribe(
      resp => {
        console.log(resp);
        this.navCtrl.push('GamesPage', {
          games: resp
        });
      },
      err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Error while searching for game in database.' + err.error.detail,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

}
