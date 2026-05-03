import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastState = signal<ToastMessage | null>(null);

  readonly toast = this.toastState.asReadonly();

  show(message: string, type: ToastMessage['type'] = 'info'): void {
    this.toastState.set({ message, type });
    window.setTimeout(() => this.clear(), 3500);
  }

  clear(): void {
    this.toastState.set(null);
  }
}
