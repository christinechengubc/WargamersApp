import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from "@ionic/storage";
import { NetworkProvider } from "../network/network";
import {HttpClient, HttpEvent, HttpResponse} from "@angular/common/http";
import {API_URL} from "../API_URL";
import {Response} from "../../models/Response";
import {Event} from "../../models/Event";
import {GlobalVars} from "../global-vars/global-vars";

@Injectable()
export class EventProvider {

  constructor(public http: HttpClient, public storage: Storage, public globalVars : GlobalVars) {
  }

  // Returns an Observable of the GET request.
  // You can use it to cancel or retry the call.
  // A subscription is created to store the results in the cache.
  getAndStoreInCache() {
    let eventsObservable = this.http.get<Response>(API_URL + '/' + "events", this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      eventsObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            let events = res.result.events;
            this.storage.set("events", events).then(
              () => {
                observer.next(events);
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

  // Returns an Observable of an array of Events.
  getFromCache() {
    return Observable.create((observer: any) => {
      this.storage.get("events")
        .then((events) => {
        if (events == null) {
          observer.next([]);
        } else {
          observer.next(events);
        }
      }).catch((err) => {
        observer.error(err);
      });
    });
  }


  // Returns an Observable of the PUT request.
  // A subscription is created to edit the event in the cache, if it exists. If it doesn't, it is added.
  put(event: any) {
    let eventsObservable = this.http.put<Response>(API_URL + '/' + "events/" + event.id, event, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      eventsObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("events").then(events => {
              if (events == null) {
                events = [];
              }
              this.replaceEvent(events, event);
              this.storage.set("events", events).then(
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
  // A subscription is created to add the event to the cache.
  post(event: any) {
    let eventsObservable = this.http.post<Response>(API_URL + '/' + "events", event, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      eventsObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("events").then(events => {
              if (events == null) {
                events = [];
              }
              event.id = res.result.event_id;
              events.push(event);
              this.storage.set("events", events).then(
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

  // Returns an Observable of the DELETE request.
  // A subscription is created to delete the event from the cache, if it exists.
  delete(event: any) {
    let eventsObservable = this.http.delete<Response>(API_URL + '/' + "events/" + event.id, this.globalVars.getHeaderWithToken()).share();

    return Observable.create(observer => {
      eventsObservable.subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.storage.get("events").then(events => {
              if (events == null) {
                events = [];
              }
              this.deleteEvent(events, event);
              this.storage.set("events", events).then(
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

  // If the event already exists, the old event is removed first before pushing.
  // Otherwise, the event is pushed to the array.
  replaceEvent(events: Event[], eventToReplaceWith: Event) {
    for (let i in events) {
      let event = events[parseInt(i)];
      if (event.id === eventToReplaceWith.id) {
        events.splice(parseInt(i), 1);
      }
    }
    events.push(eventToReplaceWith);
  }

  // Searches for an existing event and deletes it.
  deleteEvent(events: Event[], eventToReplaceWith: Event) {
    for (let i in events) {
      let event = events[parseInt(i)];
      if (event.id === eventToReplaceWith.id) {
        events.splice(parseInt(i), 1);
      }
    }
  }

}
