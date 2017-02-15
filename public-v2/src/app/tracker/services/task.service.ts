import {Injectable} from '@angular/core';
import {TaskResource} from "../resources/tasks.resource";
//
import {Observable} from 'rxjs/Observable';
import {Task} from '../models/task';
// import {Post} from '../models/post';
// import {PostResource} from '../resources/post.resource';
//
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/catch'
//
@Injectable()
export class TaskService {
  constructor(private taskResource: TaskResource) {
  }

  getPosts(): Observable<Task[]> {
    return this.taskResource.getTasks()
      .$observable
      .map((posts) => {
        return posts;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  saveTask(task: Task): Observable<Task> {
    return this.taskResource.save(task)
      .$observable
      .map((task) => {
        return task;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskResource.update(task, {taskId: task._id})
      .$observable
      .map((task) => {
        return task;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  save(task: Task): Observable<Task> {
    return task && task._id ? this.updateTask(task) : this.saveTask(task);
    // return this.taskResource.save(task)
    //   .$observable
    //   .map((post) => {
    //     return post;
    //   })
    //   .catch((err) => {
    //     return Observable.throw(err);
    //   });
  }
}
//

//
//   getPost(postId: string): Observable<Post> {
//     return this.postResource.getPost({postId: postId})
//       .$observable
//       .map((post) => {
//         return post;
//       })
//       .catch((err) => {
//         return Observable.throw(err);
//       });
//   }
//
//   savePost(post: Post): Observable<Post> {
//     return this.postResource.save(post)
//       .$observable
//       .map((post) => {
//         return post;
//       })
//       .catch((err) => {
//         return Observable.throw(err);
//       });
//   }
//
//   editPost(post: Post): Observable<Post> {
//     return this.postResource.update(post, {postId: '' + post._id})
//       .$observable
//       .map((post) => {
//         return post;
//       })
//       .catch((err) => {
//         return Observable.throw(err);
//       });
//   }
//
//   save(post: Post): Observable<Post> {
//     if (post && post._id) {
//       return this.editPost(post);
//     } else {
//       return this.savePost(post);
//     }
//   }
//
//   remove(post: Post): Observable<Post> {
//     return this.postResource.remove({postId: '' + post._id})
//       .$observable
//       .map(() => {
//         return null;
//       })
//       .catch((err) => {
//         return Observable.throw(err);
//       });
//   }
// }
