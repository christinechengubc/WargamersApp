import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { EventInfoPage } from './event-info';

@NgModule({
  declarations: [
    EventInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EventInfoPage),
    TranslateModule.forChild()
  ],
  exports: [
    EventInfoPage
  ]
})
export class EventInfoPageModule {}
