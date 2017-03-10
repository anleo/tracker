export class TaskStatus {
  public static TASK_STATUS_NEW = 'new';
  public static TASK_STATUS_ACCEPTED = 'accepted';
  public static TASK_STATUS_IN_PROGRESS = 'in_progress';

  id: string;
  name: string;
  value: string;
}
