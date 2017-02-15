"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var http_1 = require("@angular/http");
var core_2 = require("@angular/core");
var http_2 = require("@angular/http");
var ng2_resource_rest_1 = require("ng2-resource-rest");
var TaskResource = (function (_super) {
    __extends(TaskResource, _super);
    function TaskResource(http, injector) {
        return _super.call(this, http, injector) || this;
    }
    return TaskResource;
}(ng2_resource_rest_1.Resource));
__decorate([
    ng2_resource_rest_1.ResourceAction({
        method: http_1.RequestMethod.Post
    }),
    __metadata("design:type", Function)
], TaskResource.prototype, "save", void 0);
__decorate([
    ng2_resource_rest_1.ResourceAction({
        path: '/',
        isArray: true
    }),
    __metadata("design:type", Function)
], TaskResource.prototype, "getTasks", void 0);
TaskResource = __decorate([
    core_1.Injectable(),
    ng2_resource_rest_1.ResourceParams({
        url: '/api/tasks'
    }),
    __metadata("design:paramtypes", [http_2.Http, core_2.Injector])
], TaskResource);
exports.TaskResource = TaskResource;
//# sourceMappingURL=tasks.resource.js.map