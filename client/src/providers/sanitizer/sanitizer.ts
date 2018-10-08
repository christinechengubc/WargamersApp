import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';


/*
  Generated class for the SanitizerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SanitizerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SanitizerProvider Provider');
  }


  checkIfIntegersArePositive(integers: any) {
    var areIntegersPositive: boolean = true;
    integers.forEach((integer) => {
      if (integer < 0) {
        areIntegersPositive = false;
      }
    });
    return areIntegersPositive;
  }

  checkIfPositive(numbers: any) {
    var isPositive: boolean = true;
    numbers.forEach((number) => {
      if (number < 0) {
        isPositive = false;
      }
    });
    return isPositive;
  }

  checkIfIntegersOnlyIncludeNumerical(integers: any) {
    var onlyNumerical: boolean = true;
    integers.forEach((integer) => {
      if (!(String(integer).match(/^0*[1-9]\d*$/))) {
        onlyNumerical = false;
      }
    });
    return onlyNumerical;
  }

  checkIfInput(integers: any) {
    var asdf: boolean = true;
    integers.forEach((integer) => {
      if (integer == '') {
        asdf = false;
      }
    });
    return asdf;
  }

}
