import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import {Config, Events, Nav, Platform, ToastController} from 'ionic-angular';
import { Storage} from "@ionic/storage";
import { FirstRunPage } from '../pages/pages';
import { Network } from "@ionic-native/network";
import {EventProvider, ExecutiveProvider, GameProvider, LoginProvider} from "../providers/providers";
import {LoadingController} from "ionic-angular";
import {Observable} from "rxjs";

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Main', component: 'TabsPage' },
    { title: 'Search', component: 'SearchPage' },
  ];

  constructor(private translate: TranslateService, platform: Platform, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,
              private network: Network, private toastCtrl: ToastController, private storage : Storage,
              private eventProvider : EventProvider, private execProvider : ExecutiveProvider, private gameProvider : GameProvider, private loadingCtrl: LoadingController,
              private appEvents: Events, private loginProvider: LoginProvider) {
    platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString("#1E2123");
      this.statusBar.show();
      this.splashScreen.hide();
    });
    this.initTranslate();
    this.initNetwork();
    this.initLoad();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }


    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  initNetwork() {
    this.network.onDisconnect().subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'You are currently offline. Some features may be disabled while offline.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
    this.network.onConnect().subscribe(() => {
    });
  }

  initLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.storage.get("token").then(
      token => {
        if (token != null) {
          this.loginProvider.checkIfTokenStillValid(token);
        }
        Observable.forkJoin(
          this.gameProvider.getAndStoreInCache(),
          this.eventProvider.getAndStoreInCache(),
          this.execProvider.getAndStoreInCache(),
        ).subscribe(
          () => {},
          (err) => {
            let error = this.toastCtrl.create({
              message: "Error fetching something from API: " + err.error.message,
              duration: 3000,
              position: 'top'
            });
            error.present();
            loading.dismiss();
          },
          () => {
            loading.dismiss();
            this.appEvents.publish("refreshEvents");
            this.appEvents.publish("refreshGames");
          }
        )
      }
    )
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
