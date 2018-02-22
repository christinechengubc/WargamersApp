import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { EventsPage } from './events';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    TranslateModule.forChild()
  ],
  exports: [
    EventsPage
  ]
})
export class EventsPageModule {}
