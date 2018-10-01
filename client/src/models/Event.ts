interface IEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  always_show: boolean;
  lead_exec: string;
  fb_event_page: string;
  image: string;
}

export class Event {

  public id: number;
  public title: string;
  public description: string;
  public date: string;
  public start_time: string;
  public end_time: string;
  public location: string;
  public always_show: boolean;
  public lead_exec: string;
  public fb_event_page: string;
  public image: string;

  constructor(obj?: IEvent) {
    this.id             = obj && obj.id;
    this.title          = obj && obj.title || "";
    this.description    = obj && obj.description || "";
    this.date           = obj && obj.date || "";
    this.start_time     = obj && obj.start_time || "";
    this.end_time       = obj && obj.end_time || "";
    this.location       = obj && obj.location || "";
    this.always_show    = obj && obj.always_show || false;
    this.lead_exec      = obj && obj.lead_exec || "";
    this.fb_event_page  = obj && obj.fb_event_page || "";
    this.image          = obj && obj.image || "";
  }
}
