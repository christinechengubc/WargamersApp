interface IExecutive {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
}

export class Executive {

  public id: number;
  public name: string;
  public position: string;
  public phone: string;
  public email: string;

  constructor(obj?: IExecutive) {
    this.id       = obj && obj.id;
    this.name     = obj && obj.name || "";
    this.position = obj && obj.position || "";
    this.phone    = obj && obj.phone || "";
    this.email    = obj && obj.email || "";
  }
}
