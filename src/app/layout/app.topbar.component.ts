import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AccessTokenService } from '../modules/auth/shared/services/access-token.service';
import { AuthRepository } from '../modules/auth/shared/services/auth.repository';
import { ClientsTrainersService } from '../shared/services/cliens-trainers.service';
interface User {
  id: number;
  username: string;
  email: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss'],
})
export class AppTopbarComponent implements OnInit, OnDestroy {
  @ViewChild('menubutton') menuButton!: ElementRef;

  isLoggedOut: boolean = true;

  private subscription: Subscription = new Subscription();

  searchBarControl: FormControl = new FormControl('');

  users: User[] = [];

  constructor(
    public layoutService: LayoutService,
    private accessTokenService: AccessTokenService,
    private readonly httpClient: HttpClient,
    private authRepository: AuthRepository,
    private readonly clientsTrainersService: ClientsTrainersService
  ) {}

  ngOnInit(): void {
    const islogged = this.accessTokenService.isLoggedOut.subscribe(
      (isLoggedOut) => {
        this.isLoggedOut = isLoggedOut;
      }
    );
    this.subscription.add(islogged);

    this.searchBarControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        switchMap((value) =>
          this.httpClient.get(`/users/search?query=${value}`)
        )
      )
      .subscribe((response) => {
        this.users = response as User[];
      });
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  logout() {
    this.accessTokenService.deleteAccessToken();
    this.authRepository.setLoggedIn(false);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onUserSearch(userId: number): void {
    this.clientsTrainersService.userSelected(userId);
  }
}
