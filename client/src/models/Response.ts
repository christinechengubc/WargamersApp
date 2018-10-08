// Interface for describing all generic responses that come from the API.
export interface Response {
  status: string;
  code: number;
  message: string;
  result: any;
}
