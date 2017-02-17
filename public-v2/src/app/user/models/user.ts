import {Local} from './local';
import {Facebook} from './facebook';
import {Twitter} from './twitter';
import {Google} from './google';

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
