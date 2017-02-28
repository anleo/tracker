import {User} from "../../user/models/user";
import {Task} from "./task";
export class HistoryMessage{

  task: Task;
  user: User;
  updatedAt: string;
  _type?:string;
  text?: string = '';
  complexity?: number;
  points?: number;
  developer?: User;
  estimatedTime?: number;
  velocity?: number;
  spenttime?: number;
  status?: string;
}
