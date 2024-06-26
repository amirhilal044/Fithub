import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { DateTime } from 'luxon';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { AuthRoutes, ModuleRoutes } from 'src/app/shared/enums/routes.enum';
import { TokenKeys } from 'src/app/shared/enums/tokens.enum';
import { JwtData } from 'src/app/shared/models/jwt-data.model';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenService {
  public accessTokenData: JwtData | undefined = undefined;
  public isLoggedOut = new BehaviorSubject<boolean>(!this.isLoggedIn());
  private expiryDate: Date = DateTime.now().plus({ days: 1 }).toJSDate();

  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router
  ) {}

  public isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  public decodeAccessToken(accessToken: string): void {
    const decodedAccessToken: JwtData = jwtDecode(accessToken);

    this.accessTokenData = {
      ...decodedAccessToken,
      expiryDate: this.expiryDate,
    };
  }

  public setAccessToken(accessToken: string): void {
    this.cookieService.set(
      TokenKeys.JwtCookie,
      accessToken,
      this.expiryDate,
      '/'
    );

    this.isLoggedOut.next(false);
  }

  public deleteAccessToken(): void {
    this.cookieService.delete(TokenKeys.JwtCookie, '/');
    this.cookieService.delete(TokenKeys.MailCookie);
    this.cookieService.delete(TokenKeys.UserIdCookie, '/');
    this.cookieService.delete(TokenKeys.UserCookie, '/');
    this.accessTokenData = undefined;
    this.router.navigate([ModuleRoutes.Auth, AuthRoutes.Login]);

    this.isLoggedOut.next(true);
  }

  public getAccessToken(): string {
    return this.cookieService.get(TokenKeys.JwtCookie);
  }

  public setMailCookie(mail: string): void {
    this.cookieService.set(TokenKeys.MailCookie, mail);
  }

  public getMailCookie(): string {
    return this.cookieService.get(TokenKeys.MailCookie);
  }

  public setUserIdCookie(userId: number): void {
    this.cookieService.set(
      TokenKeys.UserIdCookie,
      userId.toString(),
      this.expiryDate,
      '/'
    );
  }

  public getUserIdCookie(): number {
    return parseInt(this.cookieService.get(TokenKeys.UserIdCookie));
  }

  public setUserInfo(user: any): void {
    this.cookieService.set(
      TokenKeys.UserCookie,
      JSON.stringify(user),
      this.expiryDate,
      '/'
    );
  }
  public getUserInfo(): any {
    const userCookie = this.cookieService.get(TokenKeys.UserCookie);

    if (!userCookie) {
      return '';
    }

    return JSON.parse(userCookie);
  }
}
