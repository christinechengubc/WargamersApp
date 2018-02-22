import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GamesPage } from './games';

@NgModule({
  declarations: [
    GamesPage,
  ],
  imports: [
    IonicPageModule.forChild(GamesPage),
    TranslateModule.forChild()
  ],
  exports: [
    GamesPage
  ]
})
export class GamesPageModule {}
