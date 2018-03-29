import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchBy: any = 'game';

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toastCtrl: ToastController) { }

  search() {
    let body: any = {};
    if (this.searchBy === 'game') {
      // search by game
      body = {
        title: this.title,
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
        minPlaytime: this.minPlaytime,
        maxPlaytime: this.maxPlaytime,
        difficulty: this.difficulty
      }
    } else if (this.searchBy === 'publisher') {
      // search by publisher
      body = {
        publisher: this.pubName,
        country: this.pubCountry
      }
    } else if (this.searchBy === 'genre') {
      // search by genre
      body = {
        genre: this.genreName
      }
    }

    this.api.post('search/' + this.searchBy, body).subscribe(
      resp => {
        console.log(resp);
        let toast = this.toastCtrl.create({
          message: 'Succesfully posted game to database!',
          duration: 3000,
          position: 'top'
        });
        this.navCtrl.push('GamesPage', {
          games: resp.data
        });
      },
      err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Error while searching for game in database.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )
  }

}
