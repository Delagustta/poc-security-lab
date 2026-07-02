import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-info-field',
  imports: [],
  template: `
    <p>
      <strong>{{ label() }}:</strong>
      <span>{{ value() }}</span>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
