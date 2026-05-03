import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty-state">
      <strong>{{ title() }}</strong>
      <p>{{ message() }}</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  readonly title = input('Nothing found');
  readonly message = input('Try changing your filters or add a new record.');
}
