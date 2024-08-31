import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let loggedUserData: any = {};

    const localData = localStorage.getItem('user');
    if (localData) {
      loggedUserData = JSON.parse(localData);
    }
    const cloneRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${loggedUserData.accessToken}`,
      },
    });
    return next.handle(cloneRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403 && localData) {
          const isRefresh = confirm(
            'Your session is expired. Do you want to continue..?'
          );
          if (isRefresh) {
            this.userService.$refreshToken.next(true);
            this.router.navigate([this.router.url]);
          }
        }
        return throwError(error);
      })
    );
  }
}
