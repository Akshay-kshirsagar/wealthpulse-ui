import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div>
        <p>{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
      </div>
      <ng-content />
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly eyebrow = input('WealthPulse');
}
