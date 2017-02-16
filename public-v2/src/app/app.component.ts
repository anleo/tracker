import {Component, OnInit} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
// TODO @@@id: clean all of this
  constructor(private http: Http) {
    console.log('app');
  }

  headers = new Headers({'Content-Type': 'application/json'});
  username: string = 'test';
  password: string = 'test';
  title = 'app works!';

  ngOnInit(): void {
    console.log('ollala')
    this.login().subscribe(() => console.log('login!'));
  }

  login(): Observable <any> {
    console.log('run run run');
    return this.http.post('/api/login', JSON.stringify({
      username: this.username,
      password: this.password
    }), {headers: this.headers})
  }
}
