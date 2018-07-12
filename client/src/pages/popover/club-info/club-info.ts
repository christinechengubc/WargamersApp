import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { API_URL } from '../../url';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-club-info',
  templateUrl: 'club-info.html'
})
export class ClubInfoPage {

  execs: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.http.get(API_URL + '/executives').map(res => res.json()).subscribe(
      data => {
        this.execs = data.result.executives;
        console.log("now logging");
        console.log(data.result.executives);
      },
      err => {
        console.log("Oops!");
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClubInfoPage');
  }
}
