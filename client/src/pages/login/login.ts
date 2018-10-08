import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { LoginProvider} from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loginProvider: LoginProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  doLogin() {
    this.loginProvider.login(this.account).subscribe(
      () => {
        this.navCtrl.push(MainPage);
        let toast = this.toastCtrl.create({
          message: 'Logged in successfully! Welcome!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      },
      (err: any) => {
        let toast = this.toastCtrl.create({
          message: "Unable to login: " + err.error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }
}
