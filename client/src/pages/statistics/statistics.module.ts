import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsPage } from './statistics';

@NgModule({
  declarations: [
    StatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticsPage),
    TranslateModule.forChild()
  ],
  exports: [
    StatisticsPage
  ]
})
export class StatisticsPageModule {}
