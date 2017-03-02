import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {BrowserTitles} from './browser-titles';

@Injectable()
export class BrowserTitleService {
  browserTitle = BrowserTitles;

  constructor(private Title: Title) {
  }

  getTitleByUrl(url: string) {
    let title = (this.browserTitle[url] && this.browserTitle[url].title) || 'Tracker V2';
    this.setTitle(title);
    return title;
  }

  setTitle(title: string) {
    this.Title.setTitle(title);
    return title;
  }

  setTitleWithPrefix(title: string, prefix: string) {
    if (prefix) {
      title = title + ' | ' + prefix;
    }

    this.Title.setTitle(title);
    return title;
  }
}
