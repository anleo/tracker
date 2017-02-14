export class User {
  _id: string;
  first: string;
  last: string;
  email: string;
  local: {
    username: string;
  };
  facebook: {
    id: string;
    email: string;
    token: string
  };
  twitter: {
    id: string;
    token: string
  };
  google: {
    id: string;
    email: string;
    token: string
  };
  created: string
}
