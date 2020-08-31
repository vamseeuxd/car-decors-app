import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable(
  {providedIn: 'root'},
)
export class BusyIndicatorService {

  busyIndicators: number[] = [];
  busyIndicatorsAction: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(this.busyIndicators);
  busyIndicators$ = this.busyIndicatorsAction.asObservable();


  show() {
    const newId = new Date().getTime();
    this.busyIndicators.push(newId);
    this.busyIndicatorsAction.next(this.busyIndicators);
    return newId;
  }

  hide(busyIndicatorId: number) {
    const index = this.busyIndicators.indexOf(busyIndicatorId);
    if (index >= 0) {
      this.busyIndicators.splice(index, 1);
      this.busyIndicatorsAction.next(this.busyIndicators);
    }
  }

}
