import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

export enum ConnectionStatus {
  Online,
  Offline
}


@Injectable()
export class NetworkProvider {

  status: ConnectionStatus;

  constructor(public network: Network) {
    this.status = ConnectionStatus.Online;
    this.network.onDisconnect().subscribe(() => {
      this.status = ConnectionStatus.Offline;
    });
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.status = ConnectionStatus.Online;
      }, 3000)
    });
  }

  isOnline() {
    return this.status === ConnectionStatus.Online;
  }

}
