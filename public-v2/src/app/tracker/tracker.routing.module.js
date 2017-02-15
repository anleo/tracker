"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var tasks_component_1 = require("./tasks/tasks.component");
var routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
    {
        path: 'tasks',
        component: tasks_component_1.TasksComponent
    },
    {
        path: '**',
        redirectTo: 'tasks'
    }
];
var TrackerRoutingModule = (function () {
    function TrackerRoutingModule() {
    }
    return TrackerRoutingModule;
}());
TrackerRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], TrackerRoutingModule);
exports.TrackerRoutingModule = TrackerRoutingModule;
//# sourceMappingURL=tracker.routing.module.js.map