export class Local {
  username: string = '';
}

export class User {
  first: string = '';
  last: string = '';
  email: string = '';
  local: Local = new Local();
}
