import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameInfoPage } from './game-info';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GameInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GameInfoPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    GameInfoPage
  ]
})
export class GameInfoPageModule {}
