import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchBy: any = 'game';

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  search() {
    if (this.searchBy === 'game') {
      // search by game
    } else if (this.searchBy === 'publisher') {
      // search by publisher
    } else if (this.searchBy === 'genre') {
      // search by genre
    }
    this.navCtrl.push('GamesPage');
  }

}
