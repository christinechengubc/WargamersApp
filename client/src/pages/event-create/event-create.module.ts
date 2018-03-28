import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCreatePage } from './event-create';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EventCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCreatePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    EventCreatePage
  ]
})
export class EventCreatePageModule {}
