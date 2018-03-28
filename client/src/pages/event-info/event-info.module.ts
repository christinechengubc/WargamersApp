import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { EventInfoPage } from './event-info';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EventInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EventInfoPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    EventInfoPage
  ]
})
export class EventInfoPageModule {}
