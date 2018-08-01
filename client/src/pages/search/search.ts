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
  title: any;
  minPlayers: any;
  maxPlayers: any;
  minPlaytime: any;
  maxPlaytime: any;
  difficulty: any;
  pubName: any;
  pubCountry: any;
  genreName: any;
  projectpublisher: any = false;
  projectrating: any = false;
  projectdescription: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toastCtrl: ToastController) { }

  search() {
    let body: any = {
      projectpublisher: this.projectpublisher,
      projectrating: this.projectrating,
      projectdescription: this.projectdescription
    };
    console.log(body);
    if (this.searchBy === 'game') {
      // search by game
      body.title = this.title;
      body.minPlayer = this.minPlayers;
      body.maxPlayer = this.maxPlayers;
      body.minPlaytime = this.minPlaytime;
      body.maxPlaytime = this.maxPlaytime;
      body.difficulty = this.difficulty;
    } else if (this.searchBy === 'publisher') {
      // search by publisher
      body.publisher = this.pubName;
      body.country = this.pubCountry;
    } else if (this.searchBy === 'genre') {
      // search by genre
      body.genre = this.genreName;
    }



      this.api.post('search/' + this.searchBy, body).subscribe(
        resp => {
          let toast = this.toastCtrl.create({
            message: 'Succesfully posted game to database!',
            duration: 3000,
            position: 'top'
          });
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
