export class User {
  _id: string = '';
  first: string = '';
  last: string = '';
  email: string = '';
  local: Local = new Local();
  facebook: Facebook = new Facebook();
  twitter: Twitter = new Twitter();
  google: Google = new Google();
  created: string = '';
}

export class Local {
  username: string = '';
}

export class Facebook {
  id: string = '';
  email: string = '';
  token: string = '';
}

export class Twitter {
  id: string = '';
  token: string = '';
}

export class Google {
  id: string = '';
  email: string = '';
  token: string = '';
}
