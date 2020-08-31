import {Component, ElementRef, EventEmitter, HostBinding, Output, ViewChild} from '@angular/core';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';

@Component({
  selector: 'ngx-busy-indicator',
  styleUrls: ['./busy-indicator.component.scss'],
  template: `
    <div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <label class="text-light">Please wait...</label>
  `,
})
export class BusyIndicatorComponent {
  @HostBinding('class') className = 'd-none';

  constructor(public busyIndicatorService: BusyIndicatorService) {
    this.busyIndicatorService.busyIndicators$.subscribe(value => {
      this.className = value.length > 0 ? 'd-flex' : 'd-none';
    });
  }
}
