import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly serverError = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  protected readonly emailError = computed(() => this.getFieldError('email'));
  protected readonly passwordError = computed(() => this.getFieldError('password'));

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl(this.getReturnUrl());
        },
        error: (error: unknown) => {
          this.serverError.set(this.toErrorMessage(error));
        }
      });
  }

  private getFieldError(fieldName: 'email' | 'password'): string {
    const control = this.form.controls[fieldName];

    if (!control.invalid || (!control.touched && !this.submitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return fieldName === 'email' ? 'Enter your email address.' : 'Enter your password.';
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters.';
    }

    return 'Check this field and try again.';
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return '/dashboard';
    }

    return returnUrl;
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'The email or password you entered is incorrect.';
      }

      if (error.status === 0) {
        return 'We could not reach the sign-in service. Check your connection and try again.';
      }
    }

    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return 'The email or password you entered is incorrect.';
    }

    return 'Sign-in failed. Please try again.';
  }
}
