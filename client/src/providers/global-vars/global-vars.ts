import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class GlobalVars {

  token = "";

  constructor(public http: HttpClient) {

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
