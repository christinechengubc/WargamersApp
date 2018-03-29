import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { EventsPage } from './events';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    EventsPage
  ]
})
export class EventsPageModule {}
