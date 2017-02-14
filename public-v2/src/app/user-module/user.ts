export class User {
  first: string;
  last: string;
  email: string;
  local: {
    username: {type: string, index: true}
  }
}
