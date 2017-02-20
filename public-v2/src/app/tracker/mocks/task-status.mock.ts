import {TaskStatus} from "../models/task-status";

export const TaskStatusMock: TaskStatus[] = [
  {
    id: 'new',
    name: 'New',
    value: ''
  },
  {
    id: 'in_progress',
    name: 'In progress',
    value: 'in progress'
  },
  {
    id: 'accepted',
    name: 'Accepted',
    value: 'accepted'
  }
];

