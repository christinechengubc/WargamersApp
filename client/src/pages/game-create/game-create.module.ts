import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameCreatePage } from './game-create';

@NgModule({
  declarations: [
    GameCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(GameCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    GameCreatePage
  ]
})
export class GameCreatePageModule {}
