"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var tasks_resource_1 = require("../resources/tasks.resource");
//
var Observable_1 = require("rxjs/Observable");
// import {Post} from '../models/post';
// import {PostResource} from '../resources/post.resource';
//
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/catch'
//
var PostService = (function () {
    function PostService(taskResource) {
        this.taskResource = taskResource;
    }
    PostService.prototype.getPosts = function () {
        return this.taskResource.getTasks()
            .$observable
            .map(function (posts) {
            return posts;
        })
            .catch(function (err) {
            return Observable_1.Observable.throw(err);
        });
    };
    return PostService;
}());
PostService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [tasks_resource_1.TaskResource])
], PostService);
exports.PostService = PostService;
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
//# sourceMappingURL=task.service.js.map