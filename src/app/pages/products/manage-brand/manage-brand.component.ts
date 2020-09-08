import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';
import * as firebase from 'firebase';

export interface BrandInterface {
  name: string;
  id: string;
  createdOn: string;
  updatedOn: string;
  deleted: boolean;
}

@Component({
  selector: 'ngx-form-inputs',
  styleUrls: ['./manage-brand.component.scss'],
  templateUrl: './manage-brand.component.html',
})
export class ManageBrandComponent {

  private itemsCollection: AngularFirestoreCollection<BrandInterface>;
  brands$: Observable<BrandInterface[]>;
  timestamp;
  brandIdToEdit = '';

  constructor(
    public firestore: AngularFirestore,
    public busyIndicatorService: BusyIndicatorService,
  ) {
    this.itemsCollection = firestore.collection<BrandInterface>('brands', ref => {
      this.timestamp = firebase.firestore.Timestamp.now().seconds * 1000;
      // console.log('timestamp', this.timestamp);
      return ref
        /*.orderBy('createdOn')
        .where('createdOn', '<', this.timestamp)*/
        .orderBy('name')
        .where('deleted', '==', false);
    });
    this.brands$ = this.itemsCollection.valueChanges();
  }

  async addItem(newBrand: HTMLInputElement) {
    if (newBrand.value.trim().length > 0) {
      const name = newBrand.value.trim();
      const busyIndicatorId = this.busyIndicatorService.show();
      const id = this.firestore.createId();
      const deleted = false;
      const createdOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.firestore.collection('brands').doc(id).set(
          {name, createdOn, id, deleted, updatedOn},
        );
        newBrand.value = '';
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
    }
  }

  async updateItem(updateBrand: HTMLInputElement, id: string) {
    if (updateBrand.value.trim().length > 0) {
      const name = updateBrand.value.trim();
      const busyIndicatorId = this.busyIndicatorService.show();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.itemsCollection.doc(id).update({name, updatedOn});
        updateBrand.value = '';
        this.brandIdToEdit = '';
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
    }
  }

  async deleteItem(id: string) {
    const isConfirmed = confirm('Are you sure! Do you want to delete?');
    if (isConfirmed) {
      const busyIndicatorId = this.busyIndicatorService.show();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.itemsCollection.doc(id).update({deleted: true, updatedOn});
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
    }
  }
}
