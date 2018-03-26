import { NgModule } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [MainMenuComponent],
	imports: [IonicModule, CommonModule],
	exports: [MainMenuComponent]
})
export class ComponentsModule {}
