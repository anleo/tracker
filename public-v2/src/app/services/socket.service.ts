import {Injectable} from '@angular/core';
// import {Location} from "@angular/common";

import * as io from "socket.io-client";
import {Observable} from "rxjs/Observable";
// import * as _ from 'lodash';

@Injectable()
export class SocketService {
  socket = null;

  constructor() {
    this.socket = io.connect('http://192.168.10.20:3000', {forceNew:true});
    // this.socket = io('http://www.google.com');

    let listener = Observable.fromEvent(this.socket, 'profile');
    listener.subscribe((message) => console.log(message));
    // this.socket.on('profile', (data) =>{
    //   console.log(data)
    // });
  }

  // private uri = window.location.protocol() + '://' + window.location.host() + ':' + window.location.port();
  // private socket = null;
  // private events = {};
  // private scopeEvents = {};
  //
  // constructor() {
  //   this.connect();
  // }
  //
  // off(event): void {
  //   this.events[event] && delete this.events[event];
  //   this.socket.off(event);
  // };
  //
  // offAll(): void {
  //   _.each(this.events, (subscribers, event) => {
  //     this.socket && this.socket.off(event);
  //   });
  // };
  //
  // on(event, subscriber): void {
  //   this.events[event] = this.events[event] || [];
  //   this.events[event] = _.union(this.events[event], [subscriber]);
  //
  //   this.socket.on(event, function () {
  //     let args = arguments;
  //     setTimeout(() => subscriber.apply(null, args), 0);
  //   });
  // };
  //
  // scopeOn(scope, event, subscriber): void {
  //   this.on(event, subscriber);
  //
  //   let scopeId = scope.$id;
  //   this.scopeEvents[scopeId] = this.scopeEvents[scopeId] || [];
  //
  //   this.scopeEvents[scopeId].push({
  //     scopeId: scopeId,
  //     event: event,
  //     subscriber: subscriber
  //   });
  //
  //   scope.$on('$destroy', () => {
  //     let subscribers = this.scopeEvents[scopeId] || [];
  //
  //     _.each(subscribers, (subscriber) => {
  //       let event = subscriber.event;
  //       this.events[event] = this.events[event] || [];
  //       this.events[event] = _.filter(this.events[event],
  //         (eventSubscriber) => eventSubscriber !== subscriber.subscriber);
  //     });
  //
  //     this.scopeEvents[scopeId] && delete this.scopeEvents[scopeId];
  //
  //     this.offAll();
  //     this.reSubscribe();
  //   });
  // };
  //
  // reSubscribe(): void {
  //   _.each(this.events, (subscribers, event) => {
  //     _.each(subscribers, (subscriber) => {
  //       this.on(event, subscriber);
  //     });
  //   });
  // };
  //
  // connect(): void {
  //   this.offAll();
  //   this.socket = io(this.uri, {multiplex: false});
  //   // this.socket = io.connect(this.uri, {forceNew: true});
  //   this.reSubscribe();
  // };
  //
  // reconnect(): void {
  //   let reconnect = _.throttle(() => {
  //     this.socket.close();
  //     this.socket.io.disconnect();
  //     this.socket.disconnect();
  //
  //     this.connect();
  //   }, 100);
  //
  //   reconnect();
  // };
}
