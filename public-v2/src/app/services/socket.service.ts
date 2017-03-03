import {Injectable, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

import * as io from "socket.io-client";
import * as _ from 'lodash';

@Injectable()
export class SocketService {
  private socket = null;
  private events = {};
  private scopeEvents = {};
  private uri = this.document.location.protocol +'//'+ this.document.location.hostname + ':' + this.document.location.port;
  //@@@TODO: to get sockets in work condition, launch client from vagrant
  // private uri = 'http://192.168.10.20:3000';

  constructor(@Inject(DOCUMENT) private document) {
    this.connect();
  }

  off(event): void {
    this.events[event] && delete this.events[event];
    this.socket.off(event);
  };

  offAll(): void {
    _.each(this.events, (subscribers, event) => {
      this.socket && this.socket.off(event);
    });
  };

  on(event, subscriber): void {
    this.events[event] = this.events[event] || [];
    this.events[event] = _.union(this.events[event], [subscriber]);

    this.socket.on(event, function () {
      let args = arguments;
      setTimeout(() => subscriber.apply(null, args), 0);
    });
  };

  scopeOn(scope, event, subscriber): void {
    this.on(event, subscriber);

    let scopeId = scope.constructor.name;
    this.scopeEvents[scopeId] = this.scopeEvents[scopeId] || [];

    this.scopeEvents[scopeId].push({
      scopeId: scopeId,
      event: event,
      subscriber: subscriber
    });

    scope.$onDestroy.subscribe((destroyed) => {
      if (!destroyed) {
        return;
      }

      let subscribers = this.scopeEvents[scopeId] || [];

      _.each(subscribers, (subscriber) => {
        let event = subscriber.event;
        this.events[event] = this.events[event] || [];
        this.events[event] = _.filter(this.events[event],
          (eventSubscriber) => eventSubscriber !== subscriber.subscriber);
      });

      this.scopeEvents[scopeId] && delete this.scopeEvents[scopeId];

      this.offAll();
      this.reSubscribe();

      scope.$onDestroy.unsubscribe();
    });
  };

  reSubscribe(): void {
    _.each(this.events, (subscribers, event) => {
      _.each(subscribers, (subscriber) => {
        this.on(event, subscriber);
      });
    });
  };

  connect(): void {
    this.offAll();
    this.socket = io.connect(this.uri, {forceNew: true});
    this.reSubscribe();
  };

  reconnect(): void {
    let reconnect = _.throttle(() => {
      this.socket.close();
      this.socket.io.disconnect();
      this.socket.disconnect();

      this.connect();
    }, 100);

    reconnect();
  };
}
