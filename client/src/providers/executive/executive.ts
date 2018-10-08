import { Injectable } from '@angular/core';
import { Storage} from "@ionic/storage";
import {Response} from "../../models/Response";
import {API_URL} from "../API_URL";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoginProvider} from "../login/login";

@Injectable()
export class ExecutiveProvider {

  constructor (public http: HttpClient, public storage: Storage, public loginProvider: LoginProvider) {
  }

  // Returns an Observable of the GET request.
  // You can use it to cancel or retry the call.
  // A subscription is created to store the results in the cache.
  getAndStoreInCache() {
    let eventsObservable = this.http.get<Response>(API_URL + '/' + "executives", this.loginProvider.getHeaderWithToken()).share();

    return Observable.create(observer => {
      eventsObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            let executives = res.result.executives;
            this.storage.set("executives", executives).then(
              () => {
                observer.next(res);
                observer.complete();
              }
            );
          }
        },
        (err) => {
          observer.error(err);
        },
        () => {
        }
      );
    });
  }

  // Returns an Observable of an array of Executives.
  getFromCache() {
    return Observable.create((observer: any) => {
      this.storage.get("executives")
        .then((executives) => {
          if (executives == null) {
            observer.next([]);
          } else {
            observer.next(executives);
          }
        }).catch((err) => {
        observer.err(err);
      });
    });
  }




}
