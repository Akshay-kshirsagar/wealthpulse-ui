import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastService } from '../shared/toast.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const token = authService.getAccessToken();

  const authRequest =
    token && !authService.isAuthEndpoint(request.url)
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : request;

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || authService.isAuthEndpoint(request.url)) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((response) =>
          next(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            })
          )
        ),
        catchError((refreshError: unknown) => {
          authService.logout();
          toastService.show('Your session expired. Please sign in again.', 'error');
          void router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
