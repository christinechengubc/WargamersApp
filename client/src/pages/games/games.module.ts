import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamesPage } from './games';
import { ComponentsModule } from '../../components/components.module'; 

@NgModule({
  declarations: [
    GamesPage,
  ],
  imports: [
    IonicPageModule.forChild(GamesPage),
		ComponentsModule
  ],
  exports: [
    GamesPage
  ]
})
export class GamesPageModule {}
