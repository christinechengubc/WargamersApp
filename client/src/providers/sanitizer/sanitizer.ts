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

  checkGameBody(game: any) {
    let checks: any[] = [];

    checks.push(this.checkTitle(game.title));
    checks.push(this.checkRating(game.rating));
    checks.push(this.checkPlayers(game.min_players, game.max_players));
    checks.push(this.checkPlaytime(game.min_playtime, game.max_playtime));
    checks.push(this.checkYearPublished(game.year_published));
    checks.push(this.checkDescription(game.description));
    checks.push(this.checkComplexity(game.complexity));
    checks.push(this.checkCategory(game.category));
    checks.push(this.checkCopies(game.available_copies, game.total_copies));
    checks.push(this.checkCondition(game.condition));
    checks.push(this.checkExpansionOf(game.expansion_of));
    checks.push(this.checkShowMainPage(game.show_main_page));
    checks.push(this.checkThumbnail(game.thumbnail));
    checks.push(this.checkImage(game.image));

    for (var check of checks) {
      if (check != "") return check;
    }

    return "";
  }

  checkTitle(title: any) {
    if (title == '') {
      return "Include a title!";
    }
    return "";
  }

  checkRating(rating: any) {
    if (rating < 0) {
      return "Rating cannot be less than 0!";
    }
    if (rating > 10) {
      return "Rating cannot be greater than 10!";
    }
    return "";
  }

  checkPlayers(min_players: any, max_players: any) {
    if (min_players == '') {
      return "Include minimum number of players!";
    }
    if (max_players == '') {
      return "Include maximum number of players!";
    }
    if (!(String(min_players).match(/^0*[1-9]\d*$/))) {
      return "Minimum number of players must be an integer!";
    }
    if (!(String(max_players).match(/^0*[1-9]\d*$/))) {
      return "Maximum number of players must be an integer!";
    }
    if (min_players < 0) {
      return "Minimum number of players must be positive!";
    }
    if (max_players < 0) {
      return "Maximum number of players must be positive!";
    }
    if (min_players > max_players) {
      return "Minimum number of players cannot be greater than the maximum!";
    }
    return "";
  }

  checkPlaytime(min_playtime: any, max_playtime: any) {
    if (min_playtime == '') {
      return "Include minimum number of players!";
    }
    if (max_playtime == '') {
      return "Include maximum number of players!";
    }
    if (!(String(min_playtime).match(/^0*[1-9]\d*$/))) {
      return "Minimum playtime must be an integer!";
    }
    if (!(String(max_playtime).match(/^0*[1-9]\d*$/))) {
      return "Maximum playtime of players must be an integer!";
    }
    if (min_playtime < 0) {
      return "Minimum playtime of players must be positive!";
    }
    if (max_playtime < 0) {
      return "Maximum playtime of players must be positive!";
    }
    if (min_playtime > max_playtime) {
      return "Minimum playtime cannot be greater than the maximum!";
    }
    return "";
  }

  checkYearPublished(year_published: any) {
    if (year_published < 0) {
      return "Year published must be greater than 0!";
    }
    return "";
  }

  checkDescription(description: any) {
    return "";
  }

  checkComplexity(complexity: any) {
    if (!(String(complexity).match(/^0*[1-9]\d*$/))) {
      return "Complexity must be an integer!"
    }
    if (complexity < 0) {
      return "Complexity cannot be less than 0!";
    }
    if (complexity > 5) {
      return "Complexity cannot be greater than 5!";
    }
    return "";
  }

  checkCategory(category: any) {
    return "";
  }

  checkCopies(available_copies: any, total_copies: any) {
    if (available_copies == '') {
      return "Include available number of copies!";
    }
    if (total_copies == '') {
      return "Include available number of copies";
    }
    if (!(String(available_copies).match(/^0*[1-9]\d*$/))) {
      return "Available number of copies must be an integer!";
    }
    if (!(String(total_copies).match(/^0*[1-9]\d*$/))) {
      return "Total number of copies must be an integer!";
    }
    if (available_copies < 0) {
      return "Available number of copies must be positive!";
    }
    if (total_copies < 0) {
      return "Total number of copies  must be positive!";
    }
    if (available_copies > total_copies) {
      return "Available number of copies cannot be greater than the total!";
    }
    return "";
  }

  checkCondition(condition: any) {
    return ""
  }

  checkExpansionOf(expansion_of: any) {
    return ""
  }

  checkShowMainPage(show_main_page: any) {
    return ""
  }

  checkThumbnail(thumbnail: any) {
    return ""
  }

  checkImage(image: any) {
    return ""
  }
}
