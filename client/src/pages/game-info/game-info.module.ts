import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameInfoPage } from './game-info';

@NgModule({
  declarations: [
    GameInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GameInfoPage),
    TranslateModule.forChild()
  ],
  exports: [
    GameInfoPage
  ]
})
export class GameInfoPageModule {}
