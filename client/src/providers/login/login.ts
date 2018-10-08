import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Response} from "../../models/Response";
import {API_URL} from "../API_URL";
import {Observable} from "rxjs";
import {Storage} from "@ionic/storage";

@Injectable()
export class LoginProvider {

  token = "";

  constructor(public http: HttpClient, public storage: Storage) {
  }


  login(accountInfo: any) {
    let observable = this.http.post<Response>(API_URL + "/login", accountInfo);
    return Observable.create(observer => {
      observable.subscribe(
        (res: Response) => {
          if (res.status === 'success') {
            this.storage.set("token", res.result.token);
            this.setToken(res.result.token);
            observer.next('success');
          }
        },
        (err) => {
          observer.error(err);
        }
      )
    });
  }

  logout() {
    this.storage.set("token", "");
    this.setToken("");
  }

  // If token from storage is still valid, keep it.
  // If it is not, clear the token from storage.
  checkIfTokenStillValid(token: any) {
    let observable = this.http.get<Response>(API_URL + "/login", {
      headers: new HttpHeaders({
        'x-access-token': token
      })
    });
    observable.subscribe(
      (res: Response) => {
        if (res.status !== "success") {
          this.storage.set("token", ""); // token no longer valid, log-out user
          this.setToken("");
        } else {
          this.setToken(token);
        }
      }
    )
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  getHeaderWithToken() {
    return {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
  }

}
