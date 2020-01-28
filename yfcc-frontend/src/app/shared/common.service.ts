import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import * as jwt_decode from 'jwt-decode';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CommonService implements HttpInterceptor {
  public loggedRole = '';
  public loggedUser: any = {};
  // http://159.65.156.169:3001/address/getAll/5ddb9b2e00dd674b85be34ae
  private siteurl = environment.siteurl;
  constructor(private http: HttpClient) {
    // httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');

    if (localStorage.loggedin === 'yes') {
      const decoded = jwt_decode(localStorage.token);
      this.loggedRole = decoded.user.role;
      this.loggedUser = decoded.user;
      // console.log('service', decoded);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (localStorage.token) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth-token', localStorage.token)
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status === 401) {
        localStorage.clear();
        window.location.replace('/login');
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  get(url: string): Observable<any> {
    return this.http.get(`${this.siteurl}${url}`)
      .pipe(catchError(this.handleError));
  }
  post(url: string, data: any): Observable<any> {
    return this.http.post(`${this.siteurl}${url}`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }
  put(url: string, data: any): Observable<any> {
    return this.http.put(`${this.siteurl}${url}`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }
  login() {
    if (localStorage.loggedin === 'yes') {
      const decoded = jwt_decode(localStorage.token);
      this.loggedRole = decoded.user.role;
      this.loggedUser = decoded.user;
      // console.log('service', decoded);
    }
  }
  logout() {
    this.loggedRole = '';
    this.loggedUser = {};
    localStorage.clear();
    // console.log('service', decoded);
  }
}
