import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClubInfoPage } from './club-info';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ClubInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ClubInfoPage),
		ComponentsModule
  ],
  exports: [
    ClubInfoPage
  ]
})
export class ClubInfoPageModule {}
