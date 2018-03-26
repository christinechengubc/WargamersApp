import { Component } from '@angular/core';
import { PopoverPage } from '../../pages/popover/popover';
import { PopoverController } from 'ionic-angular';

/**
 * Generated class for the MainMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.html'
})
export class MainMenuComponent {

  constructor(public popoverCtrl: PopoverController) {
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: event
    });
  }
}
