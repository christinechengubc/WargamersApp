import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {GlobalVars} from "../global-vars/global-vars";
import {Response} from "../../models/Response";
import {API_URL} from "../API_URL";
import {Observable} from "rxjs";
import {Game} from "../../models/Game";

@Injectable()
export class GameProvider {

  constructor(public http: HttpClient, public storage: Storage, public globalVars : GlobalVars) {

  }

  // Returns an Observable of the GET request.
  // You can use it to cancel or retry the call.
  // A subscription is created to store the results in the cache.
  getAndStoreInCache() {
    let gamesObservable = this.http.get<Response>(API_URL + '/' + "games/" + 0, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      gamesObservable.subscribe(
        (res: Response) => {
          let games = res.result.games;
          this.storage.set("games", games).then(
            () => {
              observer.next(games);
              observer.complete();
            }
          );
        },
        (err) => {
          observer.error(err);
        },
        () => {
        }
      );
    });
  }

  // Used for when scrolling down multiple pages.
  getAndAddToCache(page: number) {
    let gamesObservable = this.http.get<Response>(API_URL + '/' + "games/" + page, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      gamesObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            let games: Game[] = res.result.games;
            this.storage.get("games").then((storedGames: Game[]) => {
              for (let game of games) {
                storedGames.push(game);
              }
              this.storage.set("games", storedGames).then(
                () => {
                  observer.next(storedGames);
                  observer.complete();
                }
              );
            });
          } else if (res.code === 204) {
            observer.next([]); // you've reached the last page
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

  // Returns an Observable of an array of Games.
  getFromCache() {
    return Observable.create((observer: any) => {
      this.storage.get("games")
        .then((games) => {
          if (games == null) {
            observer.next([]);
          } else {
            observer.next(games);
          }
        }).catch((err) => {
        observer.error(err);
      });
    });
  }


  // Returns an Observable of the PUT request.
  // A subscription is created to edit the game in the cache, if it exists. If it doesn't, it is added.
  put(game: any) {
    let gamesObservable = this.http.put<Response>(API_URL + '/' + "games/" + game.id, game, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      gamesObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("games").then(games => {
              if (games == null) {
                games = [];
              }
              this.replaceGame(games, game);
              this.storage.set("games", games).then(
                () => {
                  observer.next(res);
                }
              );
            });
          }
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  // Returns an Observable of the POST request.
  // A subscription is created to add the game to the cache.
  post(game: any) {
    let gamesObservable = this.http.post<Response>(API_URL + '/' + "games/" + game.id, game, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      gamesObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("games").then(games => {
              if (games == null) {
                games = [];
              }
              game.id = res.result.game_id;
              games.push(game);
              this.storage.set("games", games).then(
                () => {
                  observer.next(res);
                }
              );
            });
          }
        },
        (err) => {
          observer.error(err);
        }
      )
    });
  }

  // Returns an Observable of the DELETE request.
  // A subscription is created to delete the game from the cache, if it exists.
  delete(game: any) {
    let gamesObservable = this.http.delete<Response>(API_URL + '/' + "games/" + game.id, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      gamesObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("games").then(games => {
              if (games == null) {
                games = [];
              }
              this.deleteGame(games, game);
              this.storage.set("games", games).then(
                () => {
                  observer.next(res);
                }
              );
            });
          }
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  // If the game already exists, the old game is removed first before pushing.
  // Otherwise, the game is pushed to the array.
  replaceGame(games: Game[], gameToReplaceWith: Game) {
    for (let i in games) {
      let game = games[parseInt(i)];
      if (game.id === gameToReplaceWith.id) {
        games.splice(parseInt(i), 1);
      }
    }
    games.push(gameToReplaceWith);
  }

  // Searches for an existing game and deletes it.
  deleteGame(games: Game[], gameToReplaceWith: Game) {
    for (let i in games) {
      let game = games[parseInt(i)];
      if (game.id === gameToReplaceWith.id) {
        games.splice(parseInt(i), 1);
      }
    }
  }



}
