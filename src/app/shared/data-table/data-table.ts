import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface DataTableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-data-table',
  template: `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th scope="col">{{ column.label }}</th>
            }
            @if (showActions()) {
              <th scope="col">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track rowKey(row)) {
            <tr>
              @for (column of columns(); track column.key) {
                <td>{{ value(row, column.key) }}</td>
              }
              @if (showActions()) {
                <td class="table-actions">
                  @if (canView()) {
                    <button type="button" class="secondary" (click)="view.emit(row)">View</button>
                  }
                  @if (canEdit()) {
                    <button type="button" class="secondary" (click)="edit.emit(row)">Edit</button>
                  }
                  @if (canDelete()) {
                    <button type="button" class="danger ghost" (click)="remove.emit(row)">Delete</button>
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTable {
  readonly columns = input.required<DataTableColumn[]>();
  readonly rows = input.required<unknown[]>();
  readonly showActions = input(false);
  readonly canView = input(true);
  readonly canEdit = input(true);
  readonly canDelete = input(true);
  readonly view = output<unknown>();
  readonly edit = output<unknown>();
  readonly remove = output<unknown>();

  protected value(row: unknown, key: string): string {
    if (!row || typeof row !== 'object') {
      return '';
    }

    const value = (row as Record<string, unknown>)[key];
    return value === null || value === undefined ? '' : String(value);
  }

  protected rowKey(row: unknown): string {
    return this.value(row, 'id') || JSON.stringify(row);
  }
}
