import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameCreatePage } from './game-create';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GameCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(GameCreatePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    GameCreatePage
  ]
})
export class GameCreatePageModule {}
