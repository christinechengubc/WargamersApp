import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-info',
  templateUrl: 'game-info.html',
})
export class GameInfoPage {

  game: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public translateService: TranslateService) {
    translateService.get('DATABASE_URL').subscribe(value => {
      var title = navParams.data.gameTitle.trim();
      console.log(title);
      this.http.get(value + "/game-info/'" + title + "'").map(res => res.json()).subscribe(
        data => {
          this.game = data.data[0];
          console.log("game variable is: ");
          console.log(this.game);
        },
        err => {
          console.log("Oops!");
          console.log(err);
        }
      );
    });
  }

  editGame() {
    this.navCtrl.push('GameCreatePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInfoPage');
  }

}
