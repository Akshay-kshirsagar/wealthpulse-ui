import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <div class="dialog-backdrop" role="presentation">
        <section class="dialog" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId">
          <h2 [id]="titleId">{{ title() }}</h2>
          <p>{{ message() }}</p>
          <div class="dialog-actions">
            <button type="button" class="secondary" (click)="cancel.emit()">Cancel</button>
            <button type="button" class="danger" (click)="confirm.emit()">Confirm</button>
          </div>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input('Confirm action');
  readonly message = input('Are you sure?');
  readonly confirm = output<void>();
  readonly cancel = output<void>();
  protected readonly titleId = `confirm-${Math.random().toString(36).slice(2)}`;
}
