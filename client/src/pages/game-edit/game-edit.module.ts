import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameEditPage } from './game-edit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GameEditPage,
  ],
  imports: [
    IonicPageModule.forChild(GameEditPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    GameEditPage
  ]
})
export class GameEditPageModule {}
