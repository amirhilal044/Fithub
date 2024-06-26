import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly httpClient: HttpClient) {}

  setLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn$.next(isLoggedIn);
  }

  getLoggedIn() {
    return this.isLoggedIn$.asObservable();
  }

  logIn(logInDetails: any): Observable<any> {
    return this.httpClient.post('/auth/login', logInDetails);
  }

  newPassword(newPasswordDetails: any): Observable<any> {
    return this.httpClient.post('/auth/change-password', newPasswordDetails);
  }
}
