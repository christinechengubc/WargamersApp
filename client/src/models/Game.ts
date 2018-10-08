interface IGame {
  id: string;
  title: string;
  category: string;
  rating: number;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  year_published: string;
  description: string;
  complexity: number;
  users_rated: number;
  available_copies: number;
  total_copies: number;
  condition: string;
  expansion_of: string;
  bgg_id: number;
  show_main_page: boolean;
  thumbnail: string;
  image: string;
  available: boolean;
}

export class Game {
  public id: string;
  public title: string;
  public category: string;
  public rating: number;
  public min_players: number;
  public max_players: number;
  public min_playtime: number;
  public max_playtime: number;
  public year_published: string;
  public description: string;
  public complexity: number;
  public users_rated: number;
  public available_copies: number;
  public total_copies: number;
  public condition: string;
  public expansion_of: string;
  public bgg_id: number;
  public show_main_page: boolean;
  public thumbnail: string;
  public image: string;
  public available: boolean;

  constructor(obj?: IGame) {
    this.id                =  obj && obj.id;
    this.title             =  obj && obj.title || "";
    this.category          =  obj && obj.category || "";
    this.rating            =  obj && obj.rating || 0;
    this.min_players       =  obj && obj.min_players || 0;
    this.max_players       =  obj && obj.max_players || 0;
    this.min_playtime      =  obj && obj.min_playtime || 0;
    this.max_playtime      =  obj && obj.max_playtime || 0;
    this.year_published    =  obj && obj.year_published || "";
    this.description       =  obj && obj.description || "";
    this.complexity        =  obj && obj.complexity || 0;
    this.users_rated       =  obj && obj.users_rated || 0;
    this.available_copies  =  obj && obj.available_copies || 0;
    this.total_copies      =  obj && obj.total_copies || 0;
    this.condition         =  obj && obj.condition || "";
    this.expansion_of      =  obj && obj.expansion_of || "";
    this.bgg_id            =  obj && obj.bgg_id || 0;
    this.show_main_page    =  obj && obj.show_main_page || false;
    this.thumbnail         =  obj && obj.thumbnail || "";
    this.image             =  obj && obj.image || "";
    this.available         = obj && obj.available || false;
  }
}
