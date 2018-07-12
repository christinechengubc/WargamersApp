import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPage } from './popover';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPage),
		ComponentsModule
  ],
  exports: [
    PopoverPage
  ]
})
export class PopoverPageModule {}
