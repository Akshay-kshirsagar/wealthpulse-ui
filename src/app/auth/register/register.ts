import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly serverError = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  protected readonly nameError = computed(() => this.getFieldError('name'));
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
      .register(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/dashboard');
        },
        error: (error: unknown) => {
          this.serverError.set(this.toErrorMessage(error));
        }
      });
  }

  private getFieldError(fieldName: 'name' | 'email' | 'password'): string {
    const control = this.form.controls[fieldName];

    if (!control.invalid || (!control.touched && !this.submitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return this.requiredMessage(fieldName);
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      return fieldName === 'name' ? 'Name must be at least 2 characters.' : 'Password must be at least 8 characters.';
    }

    return 'Check this field and try again.';
  }

  private requiredMessage(fieldName: 'name' | 'email' | 'password'): string {
    if (fieldName === 'name') {
      return 'Enter your name.';
    }

    return fieldName === 'email' ? 'Enter your email address.' : 'Enter your password.';
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 409) {
        return 'An account with this email already exists.';
      }

      if (error.status === 0) {
        return 'We could not reach the registration service. Check your connection and try again.';
      }
    }

    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return 'An account with this email already exists.';
    }

    return 'Registration failed. Please try again.';
  }
}
